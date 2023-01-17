/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsersService } from '../../users/services/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailVerifierService } from 'src/users/services/email-verifier.service';
import { EmailVerifier } from 'src/models/email-verifier.entity';
import * as crypto from 'crypto';

const salt = process.env.MTH_SALT || 'asin';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailVerifierService: EmailVerifierService,
  ) {}

  saltPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex');
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user && user.password === this.saltPassword(pass)) {
      if (user.status) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async getEmailVerification(username: string): Promise<EmailVerifier> {
    return await this.emailVerifierService.getEmailVerificationStatus(username);
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.user_id };
    return {
      jwt: this.jwtService.sign(payload, { expiresIn: '1 day' }),
      unverified: false,
    };
  }

  async masquerade(masqueradeUser: any, currUser: any) {
    const payload = {
      username: masqueradeUser.email,
      sub: masqueradeUser.user_id,
      masquerade: true,
      level: currUser.level,
    };
    return {
      jwt: this.jwtService.sign(payload, { expiresIn: '1 day' }),
      unverified: false,
    };
  }
}
