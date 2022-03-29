import { Args, ID, Query, Resolver, GqlExecutionContext, Mutation } from "@nestjs/graphql";
import { User } from "../models/user.entity";
import { UsersService } from "../services/users.service";
import { LoginInput } from "../dto/login.inputs";
import { createParamDecorator, ExecutionContext, UnauthorizedException, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../gaurds/local-auth.guard";
import { AuthService } from "../../auth/auth.service";
import { MePermission } from "../models/me-permission.entity";
import { AuthPayload } from "../dto/login.payload";
import { MeConfirmation } from "../models/me-confirmation.entity";
import { EmailVerifierService } from "../services/email-verifier.service";
import { EmailVerifier } from "../models/email-verifier.entity";
import { VerifyInput } from "../dto/verify.inputs";
import * as Moment from "moment";
import { EmailsService } from "../services/emails.service";
var base64 = require("base-64");

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const request = ctx.getContext();
  request.body = ctx.getArgs();
  return request.user;
});

@Resolver("App")
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private emailVerifierService: EmailVerifierService,
    private emailService: EmailsService
  ) {}

  @Query((returns) => MeConfirmation, { name: "verification" })
  async verification(@Args({ name: "token", type: () => String }) token: string): Promise<MeConfirmation> {
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split("-");
    //console.log(decodedToken);
    const emailVerifier = await this.emailVerifierService.findOneByUser(user_id, email);

    return {
      token,
      email: emailVerifier.email,
      status: emailVerifier.verified ? "verified" : "unverified",
    };
  }

  @Mutation((returns) => MeConfirmation)
  async verify(@Args("verifyInput") verifyInput: VerifyInput): Promise<MeConfirmation> {
    const { token } = verifyInput;
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split("-");

    const emailVerifier = await this.emailVerifierService.findOneByUser(user_id, email);
    if (!emailVerifier) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const updatedAccount = await this.usersService.updateAccount(user, verifyInput);
    if (!updatedAccount) {
      throw new UnauthorizedException();
    }

    const currentDate = new Date(Moment().format("YYYY-MM-DD HH:mm:ss"));
    const result = await this.emailVerifierService.update({
      ...emailVerifier,
      date_verified: currentDate,
      verified: 1,
    });

    return {
      token: token,
      email: emailVerifier.email,
      status: result.verified ? "verified" : "unverified",
    };
  }

  // @Mutation((returns) => MePermission)
  // @UseGuards(LocalAuthGuard)
  // public async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthPayload> {
  //    const user = await this.authService.validateUser(loginInput.username,loginInput.password);
  //     if (!user) {
  //       throw new UnauthorizedException();
  //     }
  //   return this.authService.login(user);
  // }

  @Mutation((returns) => Boolean, { name: "forgotPassword" })
  async forgotPassword(@Args({ name: "email", type: () => String }) email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.emailService.sendAccountResetPasswordEmail(user.user_id, user.email);
    return user ? true : false;
  }

  @Mutation((returns) => MeConfirmation, { name: "resetPassword" })
  async resetPassword(@Args("verifyInput") verifyInput: VerifyInput): Promise<MeConfirmation> {
    const { token } = verifyInput;
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split("-");
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const updatedAccount = await this.usersService.updateAccount(user, verifyInput);
    if (!updatedAccount) {
      throw new UnauthorizedException();
    }
    const authToken = await this.authService.login(updatedAccount);

    return {
      token: authToken.jwt,
      email: updatedAccount.email,
      status: "",
    };
  }
}
