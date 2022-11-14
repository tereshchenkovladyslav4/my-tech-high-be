import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulePeriod } from '../models/schedule-period.entity';
import { schedulePeriodInput } from '../dto/create-or-update-schedule-period.inputs';
import { SchedulePeriodHistory } from '../models/schedule-period-history.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleStatus } from '../enums';

@Injectable()
export class SchedulePeriodService {
  constructor(
    @InjectRepository(SchedulePeriod)
    private readonly repo: Repository<SchedulePeriod>,
    @InjectRepository(SchedulePeriodHistory)
    private readonly historyRepo: Repository<SchedulePeriodHistory>,
    private scheduleService: ScheduleService,
  ) {}

  async find(schoolYearId: number, studentId: number): Promise<SchedulePeriod[]> {
    const qb = this.repo
      .createQueryBuilder('SchedulePeriod')
      .leftJoinAndSelect('SchedulePeriod.Schedule', 'Schedule')
      .where(`Schedule.StudentId = ${studentId} AND Schedule.SchoolYearId = ${schoolYearId}`);
    return await qb.getMany();
  }

  async findAllHistories(schoolYearId: number, studentId: number): Promise<SchedulePeriodHistory[]> {
    const qb = this.historyRepo
      .createQueryBuilder('SchedulePeriodHistory')
      .leftJoinAndSelect('SchedulePeriodHistory.ScheduleHistory', 'ScheduleHistory')
      .where(`ScheduleHistory.StudentId = ${studentId} AND ScheduleHistory.SchoolYearId = ${schoolYearId}`);
    return await qb.getMany();
  }

  async save(schedulePeriodInput: schedulePeriodInput): Promise<SchedulePeriod[]> {
    try {
      let result: SchedulePeriod[] = [];
      const scheduleId = schedulePeriodInput.param[0].ScheduleId;
      const schedule = await this.scheduleService.findOneByScheduleId(scheduleId);
      if (schedule) {
        await this.repo.delete({ ScheduleId: scheduleId });
        result = await this.repo.save(schedulePeriodInput.param);
        if (schedule.status === ScheduleStatus.ACCEPTED) {
          const scheduleHistory = await this.scheduleService.findHistory(schedule.StudentId, schedule.SchoolYearId);
          const schedulePeriodHistory = await this.historyRepo.findOne({
            ScheduleHistoryId: scheduleId,
          });
          if (!schedulePeriodHistory) {
            schedulePeriodInput.param.map((schedulePeriod) => {
              delete schedulePeriod.schedule_period_id;
              delete schedulePeriod.ScheduleId;
            });
            await this.historyRepo.save(
              schedulePeriodInput.param.map((schedulePeriod) => ({
                ...schedulePeriod,
                ScheduleHistoryId: scheduleHistory?.schedule_history_id,
              })),
            );
          }
        }
      }
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
