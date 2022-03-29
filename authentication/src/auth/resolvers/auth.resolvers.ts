import { Args, ID, Query, Resolver, ResolveReference, Context } from '@nestjs/graphql';
import { UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { LoginInput } from '../../users/dto/login.inputs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/models/user.entity';

@Resolver()
export class AuthResolver {
  constructor( private authService: AuthService) {}

  //@Query((returns) => AuthPayload )
  //@UseGuards(LocalAuthGuard)
  // async login(@Args('input') {username, password}: LoginInput): Promise<AuthPayload> {
  //   const user = await this.authService.validateUser(username,password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   return await this.authService.login(user);
  // }
}
