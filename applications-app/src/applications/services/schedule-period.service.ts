import { Injectable, Param } from '@nestjs/common';
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

  async findAllHistories(
    schoolYearId: number,
    studentId: number,
    isSecondSemester: boolean,
  ): Promise<SchedulePeriodHistory[]> {
    const qb = this.historyRepo
      .createQueryBuilder('SchedulePeriodHistory')
      .leftJoinAndSelect('SchedulePeriodHistory.ScheduleHistory', 'ScheduleHistory')
      .where(
        `ScheduleHistory.StudentId = ${studentId} AND ScheduleHistory.SchoolYearId = ${schoolYearId} AND ScheduleHistory.is_second_semester=${isSecondSemester}`,
      );
    return await qb.getMany();
  }

  async save(schedulePeriodInput: schedulePeriodInput): Promise<SchedulePeriod[]> {
    try {
      let result: SchedulePeriod[] = [];
      const scheduleId = schedulePeriodInput.param[0].ScheduleId;
      const schedule = await this.scheduleService.findOneByScheduleId(scheduleId);
      if (schedule) {
        await this.repo.delete({ ScheduleId: scheduleId });
        result = await this.repo.save(schedulePeriodInput.param.map((item) => ({ ...item, schedule_period_id: 0 })));
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

  async restoreScheduleHistory(scheduleHistoryId: number): Promise<boolean> {
    try {
      const scheduleId = await this.scheduleService.getScheduleIdByScheduleHistoryId(scheduleHistoryId);
      const schedulePeriodHistories = await this.historyRepo.find({ ScheduleHistoryId: scheduleHistoryId });
      if (scheduleId && schedulePeriodHistories?.length) {
        await this.repo.delete({ ScheduleId: scheduleId });
        await this.repo.save(
          schedulePeriodHistories.map((periodHistory) => ({
            ScheduleId: scheduleId,
            PeriodId: periodHistory.PeriodId,
            SubjectId: periodHistory.SubjectId,
            TitleId: periodHistory.TitleId,
            ProviderId: periodHistory.ProviderId,
            CourseId: periodHistory.CourseId,
            course_type: periodHistory.course_type,
            custom_build_description: periodHistory.custom_build_description,
            tp_provider_name: periodHistory.tp_provider_name,
            tp_course_name: periodHistory.tp_course_name,
            tp_phone_number: periodHistory.tp_phone_number,
            tp_specific_course_website: periodHistory.tp_specific_course_website,
            tp_additional_specific_course_website: periodHistory.tp_additional_specific_course_website,
            osse_course_name: periodHistory.osse_course_name,
            osse_district_school: periodHistory.osse_district_school,
            osse_school_district_name: periodHistory.osse_school_district_name,
            status: periodHistory.status,
          })),
        );
        return true;
      }
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
