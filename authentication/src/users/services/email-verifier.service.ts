import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveEmailVerifierInput } from '../dto/save-email-verifier.inputs';
import { EmailVerifier } from '../models/email-verifier.entity';

@Injectable()
export class EmailVerifierService {
  constructor(
    @InjectRepository(EmailVerifier)
    private readonly emailVerifiersRepository: Repository<EmailVerifier>,
  ) {}

  async findOneByUser(user_id: number, email: string): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.findOne({
      where: {
        user_id,
        email,
      },
    });
  }

  async update(emailVerifier: SaveEmailVerifierInput): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.save(emailVerifier);
  }

  async getEmailVerificationStatus(username: string): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.findOne({ email: username });
  }
}
