import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerifier } from '../models/email-verifier.entity';
@Injectable()
export class EmailVerifiersService {
  constructor(
    @InjectRepository(EmailVerifier)
    private emailVerifiersRepository: Repository<EmailVerifier>,
  ) {}

  async getPersonEmailVerifier(user_id: number): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.findOne({ where: { user_id: user_id } });
  }
}
