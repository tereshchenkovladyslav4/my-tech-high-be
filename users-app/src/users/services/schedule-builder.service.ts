import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleBuilder } from 'src/models/scheduler-builder.entity';
import { Repository } from 'typeorm';
import { CreateScheduleBuilderInput } from '../dto/create-or-update-schedule-builder.inputs';

@Injectable()
export class ScheduleBuilderService {
  constructor(
    @InjectRepository(ScheduleBuilder)
    private scheduleBuilderRepository: Repository<ScheduleBuilder>,
  ) {}

  findOneById(school_year_id: number): Promise<ScheduleBuilder> {
    return this.scheduleBuilderRepository.findOne({
      where: { school_year_id },
    });
  }

  async createOrUpdate(schedule: CreateScheduleBuilderInput): Promise<ScheduleBuilder> {
    return this.scheduleBuilderRepository.save(schedule);
  }
}
