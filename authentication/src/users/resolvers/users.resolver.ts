import { Args, Query, Resolver, GqlExecutionContext, Mutation } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { MeConfirmation } from '../models/me-confirmation.entity';
import { EmailVerifierService } from '../services/email-verifier.service';
import { VerifyInput } from '../dto/verify.inputs';
import * as Moment from 'moment';
import { EmailsService } from '../services/emails.service';
import { ForgotPasswordResponse } from '../models/forgot-password-response';
import * as base64 from 'base-64';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const request = ctx.getContext();
  request.body = ctx.getArgs();
  return request.user;
});

@Resolver('App')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private emailVerifierService: EmailVerifierService,
    private emailService: EmailsService,
  ) {}

  @Query(() => MeConfirmation, { name: 'verification' })
  async verification(@Args({ name: 'token', type: () => String }) token: string): Promise<MeConfirmation> {
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split('-');
    const emailVerifier = await this.emailVerifierService.findOneByUser(user_id, email);

    return {
      token,
      email: emailVerifier.email,
      status: emailVerifier.verified ? 'verified' : 'unverified',
    };
  }

  @Mutation(() => MeConfirmation)
  async verify(@Args('verifyInput') verifyInput: VerifyInput): Promise<MeConfirmation> {
    const { token } = verifyInput;
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split('-');

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

    const currentDate = new Date(Moment().format('YYYY-MM-DD HH:mm:ss'));
    const result = await this.emailVerifierService.update({
      ...emailVerifier,
      date_verified: currentDate,
      verified: 1,
    });

    // create Zendesk account
    await this.usersService.createZendeskAccount(email, user);

    return {
      token: token,
      email: emailVerifier.email,
      status: result.verified ? 'verified' : 'unverified',
      level: updatedAccount.level,
    };
  }

  @Mutation(() => MeConfirmation)
  async verifyEmail(@Args('verifyInput') verifyInput: VerifyInput): Promise<MeConfirmation> {
    const { token } = verifyInput;
    const decodedToken = base64.decode(token);
    const [user_id, email] = decodedToken.split('-');

    const emailVerifier = await this.emailVerifierService.findOneByUser(user_id, email);
    if (!emailVerifier) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(user_id);
    if (!user || user.password != this.usersService.encryptPassword(verifyInput.password)) {
      throw new UnauthorizedException();
    }

    const currentDate = new Date(Moment().format('YYYY-MM-DD HH:mm:ss'));
    const result = await this.emailVerifierService.update({
      ...emailVerifier,
      date_verified: currentDate,
      verified: 1,
    });

    return {
      token: token,
      email: emailVerifier.email,
      status: result.verified ? 'verified' : 'unverified',
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

  @Mutation(() => Boolean, { name: 'resendVerificationEmail' })
  public async resendVerificationEmail(@Args({ name: 'email', type: () => String }) email: string): Promise<boolean> {
    const status = await this.usersService.resendVerificationEmail(email);
    return !!status;
  }

  @Mutation(() => ForgotPasswordResponse, { name: 'forgotPassword' })
  async forgotPassword(
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<{ status: boolean; unverified: boolean }> {
    const emailVerifier = await this.usersService.getEmailVerification(email);
    const user = await this.usersService.findOneByEmail(email);
    if (emailVerifier?.verified == 0) {
      return { status: false, unverified: true };
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.emailService.sendAccountResetPasswordEmail(user.user_id, user.email);

    return { status: true, unverified: false };
  }

  @Mutation(() => MeConfirmation, { name: 'resetPassword' })
  async resetPassword(@Args('verifyInput') verifyInput: VerifyInput): Promise<MeConfirmation> {
    const { token } = verifyInput;
    const decodedToken = base64.decode(token);
    const [user_id] = decodedToken.split('-');
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
      status: '',
    };
  }
}
