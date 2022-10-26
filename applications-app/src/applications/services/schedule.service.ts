import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../models/schedule.entity';
import { CreateOrUpdateScheduleInput } from '../dto/create-or-update-schedule.inputs';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
  ) {}

  async find(schoolYearId: number): Promise<Schedule[]> {
    const qb = this.repo.createQueryBuilder('Schedule').where({ SchoolYearId: schoolYearId });
    return await qb.getMany();
  }

  async save(scheduleInput: CreateOrUpdateScheduleInput): Promise<Schedule> {
    try {
      const result = await this.repo.save(scheduleInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(scheduleId: number): Promise<boolean> {
    try {
      await this.repo.save({ schedule_id: scheduleId });
      return true;
    } catch (error) {
      return false;
    }
  }
}
