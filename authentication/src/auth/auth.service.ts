import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/services/users.service'
import { JwtService } from '@nestjs/jwt'
const crypto = require('crypto')

const salt = process.env.MTH_SALT || 'asin'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  saltPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex')
  }

  async getVerification(token: string): Promise<any> {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username)

    if (user && user.password === this.saltPassword(pass)) {
      this.usersService.touchLastLogin(user)
      const { password, ...result } = user
      //console.log("USER: ", result);
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.user_id, ...user }
    //console.log(payload);
    return {
      jwt: this.jwtService.sign(payload)
    }
  }
}
