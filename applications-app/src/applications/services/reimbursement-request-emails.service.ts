import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReimbursementRequestEmail } from '../models/reimbursement-request-email.entity';
import { ReimbursementRequestEmailInputs } from '../dto/reimbursement-request-email.inputs';
@Injectable()
export class ReimbursementRequestEmailsService {
  constructor(
    @InjectRepository(ReimbursementRequestEmail)
    private readonly repo: Repository<ReimbursementRequestEmail>,
  ) {}

  async findByIds(ids: number[]): Promise<ReimbursementRequestEmail[]> {
    return this.repo
      .createQueryBuilder('reimbursementRequestEmail')
      .leftJoinAndSelect('reimbursementRequestEmail.EmailRecord', 'EmailRecord')
      .whereInIds(ids)
      .getMany();
  }

  async create(reimbursementRequestEmail: ReimbursementRequestEmailInputs): Promise<ReimbursementRequestEmail> {
    return this.repo.save(reimbursementRequestEmail);
  }
}
