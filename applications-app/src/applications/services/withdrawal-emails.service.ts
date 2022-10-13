import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWithdrawalEmailInput } from '../dto/new-withdrawal-email.inputs';
import { WithdrawalEmail } from '../models/withdrawal-email.entity';
@Injectable()
export class WithdrawalEmailsService {
  constructor(
    @InjectRepository(WithdrawalEmail)
    private readonly withdrawalEmailsRepository: Repository<WithdrawalEmail>,
  ) {}

  async findByApplication(withdrawal_id: number): Promise<WithdrawalEmail[]> {
    return this.withdrawalEmailsRepository.find({
      where: { withdrawal_id: withdrawal_id },
      order: { created_at: 'ASC' },
    });
  }

  async findByOrder(): Promise<string> {
    return this.withdrawalEmailsRepository
      .createQueryBuilder('withdrawalEmail')
      .select()
      .orderBy('withdrawalEmail.created_at', 'DESC')
      .addGroupBy('withdrawalEmail.withdrawal_id')
      .getQuery();
  }

  async create(withdrawalEmail: CreateWithdrawalEmailInput): Promise<WithdrawalEmail> {
    return this.withdrawalEmailsRepository.save(withdrawalEmail);
  }
}
