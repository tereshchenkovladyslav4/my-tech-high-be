import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Schedule } from '../models/schedule.entity';
import { ScheduleService } from '../services/schedule.service';
import { CreateOrUpdateScheduleInput } from '../dto/create-or-update-schedule.inputs';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private service: ScheduleService) {}

  @Query(() => [Schedule], { name: 'schedules' })
  @UseGuards(new AuthGuard())
  get(
    @Args('schoolYearId')
    schoolYearId: number,
  ): Promise<Schedule[]> {
    return this.service.find(schoolYearId);
  }

  @Mutation(() => Schedule, { name: 'createOrUpdateSchedule' })
  @UseGuards(new AuthGuard())
  async createOrUpdateSchedule(
    @Args('createScheduleInput')
    createScheduleInput: CreateOrUpdateScheduleInput,
  ): Promise<Schedule> {
    return this.service.save(createScheduleInput);
  }

  @Mutation(() => Boolean, { name: 'deleteSchedule' })
  @UseGuards(new AuthGuard())
  async deleteSchedule(
    @Args('scheduleId')
    scheduleId: number,
  ): Promise<boolean> {
    return this.service.delete(scheduleId);
  }
}
