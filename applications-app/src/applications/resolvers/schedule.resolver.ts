import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Schedule } from '../models/schedule.entity';
import { ScheduleService } from '../services/schedule.service';
import { CreateOrUpdateScheduleInput } from '../dto/create-or-update-schedule.inputs';
import { SchedulePagination } from '../models/schedule-pagination.entity';
import { SchedulesArgs } from '../dto/schedules.args';
import { Pagination } from 'src/paginate';
import { ScheduleEmail } from '../models/schedule-email.entity';
import { EmailScheduleInput } from '../dto/email-schedule.input';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private service: ScheduleService) {}

  @Query((returns) => SchedulePagination, { name: 'schedules' })
  //@UseGuards(new AuthGuard())
  async getSchedules(@Args() schedulesArgs: SchedulesArgs): Promise<Pagination<Schedule>> {
    const results = await this.service.findAll(schedulesArgs);
    return results;
  }

  @Mutation((returns) => [ScheduleEmail], { name: 'emailSchedule' })
  async emailSchedule(
    @Args('emailScheduleInput') emailScheduleInput: EmailScheduleInput,
  ): Promise<ScheduleEmail[]> {
    return await this.service.sendEmail(emailScheduleInput);
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
