import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { SchedulePeriod } from '../models/schedule-period.entity';
import { SchedulePeriodService } from '../services/schedule-period.service';
import { schedulePeriodInput } from '../dto/create-or-update-schedule-period.inputs';
import { SchedulePeriodHistory } from '../models/schedule-period-history.entity';

@Resolver(() => SchedulePeriod)
export class SchedulePeriodResolver {
  constructor(private service: SchedulePeriodService) {}

  @Query(() => [SchedulePeriod], { name: 'schedulePeriods' })
  @UseGuards(new AuthGuard())
  get(
    @Args('schoolYearId')
    schoolYearId: number,
    @Args('studentId')
    studentId: number,
  ): Promise<SchedulePeriod[]> {
    return this.service.find(schoolYearId, studentId);
  }

  @Query(() => [SchedulePeriod], { name: 'schedulePeriodsByProvider' })
  @UseGuards(new AuthGuard())
  getSchedulePeriodsByProvider(
    @Args('providerIds')
    providerIds: string,
  ): Promise<SchedulePeriod[]> {
    return this.service.findAll(providerIds);
  }

  @Query(() => [SchedulePeriodHistory], { name: 'schedulePeriodHistories' })
  //@UseGuards(new AuthGuard())
  schedulePeriodHistories(
    @Args('schoolYearId')
    schoolYearId: number,
    @Args('studentId')
    studentId: number,
    @Args('isSecondSemester')
    isSecondSemester: boolean,
  ): Promise<SchedulePeriodHistory[]> {
    return this.service.findAllHistories(schoolYearId, studentId, isSecondSemester);
  }

  @Mutation(() => [SchedulePeriod], { name: 'createOrUpdateSchedulePeriod' })
  @UseGuards(new AuthGuard())
  async createOrUpdateSchedulePeriod(
    @Args('createSchedulePeriodInput')
    createSchedulePeriodInput: schedulePeriodInput,
  ): Promise<SchedulePeriod[]> {
    return this.service.save(createSchedulePeriodInput);
  }

  @Mutation(() => Boolean, { name: 'restoreScheduleHistory' })
  @UseGuards(new AuthGuard())
  async restoreScheduleHistory(
    @Args({ name: 'schedule_history_id', type: () => Int })
    scheduleHistoryId: number,
  ): Promise<boolean> {
    return this.service.restoreScheduleHistory(scheduleHistoryId);
  }

  @Mutation(() => Boolean, { name: 'deleteSchedulePeriod' })
  @UseGuards(new AuthGuard())
  async deleteSchedule(
    @Args('schedulePeriodId')
    schedulePeriodId: number,
  ): Promise<boolean> {
    return this.service.delete(schedulePeriodId);
  }
}
