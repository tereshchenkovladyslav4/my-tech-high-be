import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmailVerifierInput } from 'src/users/dto/new-email-verifier.inputs';
import { EmailVerifier } from 'src/models/email-verifier.entity';
@Injectable()
export class EmailVerifierService {
  constructor(
    @InjectRepository(EmailVerifier)
    private readonly emailVerifiersRepository: Repository<EmailVerifier>,
  ) {}

  async create(emailVerifier: CreateEmailVerifierInput): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.save(emailVerifier);
  }

  async delete(emailVerifier: CreateEmailVerifierInput): Promise<void> {
    this.emailVerifiersRepository.delete({
      email: emailVerifier.email,
    });
  }

  async getEmailVerificationStatus(username: string): Promise<EmailVerifier> {
    return this.emailVerifiersRepository.findOne({ email: username });
  }
}
