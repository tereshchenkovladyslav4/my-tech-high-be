import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
const crypto = require('crypto');
const salt = process.env.MTH_SALT || 'asin';
import * as Moment from 'moment';
import { VerifyInput } from '../dto/verify.inputs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneById(user_id: number): Promise<User> {
    return this.usersRepository.findOne(user_id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email: email})
  }

  touchLastLogin( user: User ): Promise<User> {
    return this.usersRepository.save({...user, lastLogin: new Date().toLocaleString()})
  }

  async updateAccount( user: User, verifyInput: VerifyInput ): Promise<User> {
      const { password, confirm_password } = verifyInput;
      let pattern = new RegExp("^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$"); //Regex: At least 8 characters with at least 2 numericals
      if( !pattern.test(password))
        throw new BadRequestException('At least 8 characters with at least 2 numericals.');

      if( !password.match( confirm_password ) )
        throw new BadRequestException('The password and confirmation password do not match.');

      const updatedAt = Moment().format('YYYY-MM-DD HH:mm:ss');
      return this.usersRepository.save({ ...user, password: this.encryptPassword( password ), updatedAt })
  }

  private encryptPassword(password:string) {
    return crypto
    .createHash('md5')
    .update(`${password}${salt}`)
    .digest('hex');
  }
}
