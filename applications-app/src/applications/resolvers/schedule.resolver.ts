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
import { EmailUpdatesRequiredInput } from '../dto/email-update-required.inputs';
import { ResponseDTO } from '../dto/response.dto';
import { SchedulesGroupCountArgs } from '../dto/schedules-group-count.args';
import { EmailUpdatesAllowedInput } from '../dto/email-update-allowed.inputs';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private service: ScheduleService) {}

  @Query(() => SchedulePagination, { name: 'schedules' })
  //@UseGuards(new AuthGuard())
  async getSchedules(@Args() schedulesArgs: SchedulesArgs): Promise<Pagination<Schedule>> {
    const results = await this.service.findAll(schedulesArgs);
    return results;
  }

  @Mutation(() => [ScheduleEmail], { name: 'emailSchedule' })
  async emailSchedule(@Args('emailScheduleInput') emailScheduleInput: EmailScheduleInput): Promise<ScheduleEmail[]> {
    return await this.service.sendEmail(emailScheduleInput);
  }

  @Mutation(() => Boolean, { name: 'sendUpdatesRequiredEmail' })
  @UseGuards(new AuthGuard())
  async sendUpdatesRequiredEmail(
    @Args('updateRequiredEmail') updateRequiredEmail: EmailUpdatesRequiredInput,
  ): Promise<boolean> {
    return await this.service.sendUpdatesReqiredEmail(updateRequiredEmail);
  }

  @Mutation(() => Boolean, { name: 'sendUpdatesAllowedEmail' })
  @UseGuards(new AuthGuard())
  async sendUpdatesAllowedEmail(
    @Args('updatesAllowedEmail') updatesAllowedEmail: EmailUpdatesAllowedInput,
  ): Promise<boolean> {
    return await this.service.sendUpdatesAllowedEmail(updatesAllowedEmail);
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

  @Query(() => ResponseDTO, { name: 'scheduleCount' })
  @UseGuards(new AuthGuard())
  async getScheduleCountGroup(): Promise<ResponseDTO> {
    return this.service.getScheduleCountGroup();
  }

  @Query(() => ResponseDTO, { name: 'scheduleCountByRegionId' })
  @UseGuards(new AuthGuard())
  async getScheduleCountByRegionId(
    @Args('scheduleGroupCountArgs') scheduleGroupCountArgs: SchedulesGroupCountArgs,
  ): Promise<ResponseDTO> {
    return this.service.getScheduleCountByRegionId(scheduleGroupCountArgs);
  }
}
