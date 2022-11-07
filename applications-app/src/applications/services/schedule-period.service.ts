import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulePeriod } from '../models/schedule-period.entity';
import { schedulePeriodInput } from '../dto/create-or-update-schedule-period.inputs';

@Injectable()
export class SchedulePeriodService {
  constructor(
    @InjectRepository(SchedulePeriod)
    private readonly repo: Repository<SchedulePeriod>,
  ) {}

  async find(schoolYearId: number, studentId: number): Promise<SchedulePeriod[]> {
    const qb = this.repo
      .createQueryBuilder('SchedulePeriod')
      .leftJoinAndSelect('SchedulePeriod.Schedule', 'Schedule')
      .where(`Schedule.StudentId = ${studentId} AND Schedule.SchoolYearId = ${schoolYearId}`);
    return await qb.getMany();
  }

  async save(schedulePeriodInput: schedulePeriodInput): Promise<SchedulePeriod[]> {
    try {
      await this.repo.delete({ ScheduleId: schedulePeriodInput.param[0].ScheduleId });
      const result = await this.repo.save(schedulePeriodInput.param);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(schedulePeriodId: number): Promise<boolean> {
    try {
      await this.repo.delete({ schedule_period_id: schedulePeriodId });
      return true;
    } catch (error) {
      return false;
    }
  }
}
