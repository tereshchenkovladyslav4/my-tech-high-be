import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerifier } from '../models/email-verifier.entity';
import { CreateEmailVerifierInput } from '../dto/new-email-verifier.inputs';

@Injectable()
export class EmailVerifierService {
  constructor(
    @InjectRepository(EmailVerifier)
    private readonly emailVerifiersRepository: Repository<EmailVerifier>,
  ) {}

  async create( emailVerifier: CreateEmailVerifierInput ): Promise<EmailVerifier> {
      
      return this.emailVerifiersRepository.save(emailVerifier);
  }
}
