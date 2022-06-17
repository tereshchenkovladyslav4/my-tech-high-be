import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronJobsLog } from '../models/cron-jobs-log.entity';
import { CreateCronJobsLogInput } from '../dto/new-cron-jobs-log.inputs';

@Injectable()
export class CronJobsLogsService {
  constructor(
    @InjectRepository(CronJobsLog)
    private cronJobsLogRepository: Repository<CronJobsLog>,
  ) {}

  async save(cronJobsLog: CreateCronJobsLogInput): Promise<CronJobsLog> {
    return this.cronJobsLogRepository.save(cronJobsLog);
  }

  async findOneById(id: number): Promise<CronJobsLog> {
    return this.cronJobsLogRepository.findOne(id);
  }
}
