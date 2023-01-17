import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentUserInput } from '../dto/new-student-user.inputs';
import { User } from '../models/user.entity';
import * as crypto from 'crypto';
const salt = process.env.MTH_SALT || 'asin';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  findOneById(user_id: number): Promise<User> {
    return this.usersRepository.findOne(user_id);
  }

  private encryptPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex');
  }

  async create(user: CreateStudentUserInput): Promise<User> {
    const password =
      (user.password && this.encryptPassword(user.password)) || this.encryptPassword(new Date().toString());
    const userInput = { ...user, password };
    return this.usersRepository.save(userInput);
  }
}
