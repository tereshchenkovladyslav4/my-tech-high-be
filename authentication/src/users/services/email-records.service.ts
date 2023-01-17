import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmailRecordInput } from '../dto/new-email-record.inputs';
import { EmailRecord } from '../models/email-record.entity';

@Injectable()
export class EmailRecordsService {
  constructor(
    @InjectRepository(EmailRecord)
    private readonly emailRecordsRepository: Repository<EmailRecord>,
  ) {}

  async create(emailRecord: CreateEmailRecordInput): Promise<EmailRecord> {
    return this.emailRecordsRepository.save(emailRecord);
  }
}
