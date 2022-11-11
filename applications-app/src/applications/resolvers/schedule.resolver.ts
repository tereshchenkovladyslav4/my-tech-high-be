import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
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
import { EmailUpdateRequiredInput } from '../dto/email-update-required.inputs';
import { ResponseDTO } from '../dto/response.dto';

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
  async emailSchedule(@Args('emailScheduleInput') emailScheduleInput: EmailScheduleInput): Promise<ScheduleEmail[]> {
    return await this.service.sendEmail(emailScheduleInput);
  }

  @Mutation((returns) => Boolean, { name: 'updateRequiredEmail' })
  @UseGuards(new AuthGuard())
  async updateRequiredEmail(
    @Args('updateRequiredEmail') updateRequiredEmail: EmailUpdateRequiredInput,
  ): Promise<boolean> {
    return await this.service.sendUpdateReqiredEmail(updateRequiredEmail);
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

  @Query((returns) => ResponseDTO, { name: 'scheduleCount' })
  @UseGuards(new AuthGuard())
  async getScheduleCountGroup(): Promise<ResponseDTO> {
    return this.service.getScheduleCountGroup();
  }

  @Query((returns) => ResponseDTO, { name: 'scheduleCountByRegionId' })
  @UseGuards(new AuthGuard())
  async getScheduleCountByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<ResponseDTO> {
    return this.service.getScheduleCountByRegionId(region_id);
  }
}
