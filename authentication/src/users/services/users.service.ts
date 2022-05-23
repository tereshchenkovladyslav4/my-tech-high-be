import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../models/user.entity'
const crypto = require('crypto')
const salt = process.env.MTH_SALT || 'asin'
import * as Moment from 'moment'
import { VerifyInput } from '../dto/verify.inputs'
import { EmailsService } from './emails.service'
import { EmailVerifierService } from './email-verifier.service'
import { EmailVerifier } from '../models/email-verifier.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private emailService: EmailsService,
    private emailVerifierService: EmailVerifierService
  ) {}

  async findOneById(user_id: number): Promise<User> {
    return this.usersRepository.findOne(user_id)
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email: email })
  }

  async resendVerificationEmail(email: string): Promise<any> {
    const emailVerifier =
      await this.emailVerifierService.getEmailVerificationStatus(email)
    if (emailVerifier) {
      return await this.emailService.sendAccountVerificationEmail(emailVerifier)
    } else {
      return null
    }
  }

  async getEmailVerification(username: string): Promise<EmailVerifier> {
    return await this.emailVerifierService.getEmailVerificationStatus(username)
  }

  touchLastLogin(user: User): Promise<User> {
    return this.usersRepository.save({
      ...user,
      lastLogin: new Date().toLocaleString()
    })
  }

  async updateAccount(user: User, verifyInput: VerifyInput): Promise<User> {
    const { password } = verifyInput
    let pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!pattern.test(password))
      throw new BadRequestException(
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      );

    const updated_at = Moment().format('YYYY-MM-DD HH:mm:ss')

    return this.usersRepository.save({
      ...user,
      password: this.encryptPassword(password),
      status: '1',
      updated_at
    })
  }

  private encryptPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex')
  }
}
