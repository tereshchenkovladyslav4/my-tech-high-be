import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleEmailInput } from '../dto/schedule-emails.inputs';
import { ScheduleEmail } from '../models/schedule-email.entity';
@Injectable()
export class ScheduleEmailsService {
  constructor(
    @InjectRepository(ScheduleEmail)
    private readonly scheduleEmailsRepository: Repository<ScheduleEmail>,
  ) {}

  async create(scheduleEmail: CreateScheduleEmailInput): Promise<ScheduleEmail> {
    return this.scheduleEmailsRepository.save({ ...scheduleEmail, created_at: new Date() });
  }
}
