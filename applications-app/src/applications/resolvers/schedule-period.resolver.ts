import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Query(() => [SchedulePeriodHistory], { name: 'schedulePeriodHistories' })
  //@UseGuards(new AuthGuard())
  schedulePeriodHistories(
    @Args('schoolYearId')
    schoolYearId: number,
    @Args('studentId')
    studentId: number,
  ): Promise<SchedulePeriodHistory[]> {
    return this.service.findAllHistories(schoolYearId, studentId);
  }

  @Mutation(() => SchedulePeriod, { name: 'createOrUpdateSchedulePeriod' })
  @UseGuards(new AuthGuard())
  async createOrUpdateSchedulePeriod(
    @Args('createSchedulePeriodInput')
    createSchedulePeriodInput: schedulePeriodInput,
  ): Promise<SchedulePeriod[]> {
    return this.service.save(createSchedulePeriodInput);
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
