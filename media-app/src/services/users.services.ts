import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import * as Moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOneById(user_id: number): Promise<User> {
    return this.usersRepository.findOne(user_id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async updateAvatarUrl(user: User, key: string): Promise<User> {
    const updated_at = Moment().format('YYYY-MM-DD HH:mm:ss');
    return this.usersRepository.save({ user_id: user.user_id, avatarUrl: key, updated_at });
  }
}
