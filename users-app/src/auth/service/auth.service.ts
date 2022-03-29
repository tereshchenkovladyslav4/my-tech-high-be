import { UsersService } from '../../users/services/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const crypto = require('crypto');

const salt = process.env.MTH_SALT || 'asin';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    saltPassword(password: string) {
        return crypto
            .createHash('md5')
            .update(`${password}${salt}`)
            .digest('hex');
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

    async login(user: any) {
        const payload = { username: user.email, sub: user.user_id };
        return {
            jwt: this.jwtService.sign(payload),
        };
    }
}
