import { Resolver } from '@nestjs/graphql';
import { AuthService } from '../../auth/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
