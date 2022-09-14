import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ScheduleBuilderService } from '../services/schedule-builder.service';
import { CreateScheduleBuilderInput } from '../dto/create-or-update-schedule-builder.inputs';
import { ScheduleBuilder } from 'src/models/scheduler-builder.entity';

@Resolver((of) => ScheduleBuilder)
export class ScheduleBuilderResolver {
  constructor(private service: ScheduleBuilderService) {}

  @Query((returns) => ScheduleBuilder, { name: 'getScheduleBuilder' })
  @UseGuards(new AuthGuard())
  get(
    @Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number,
  ): Promise<ScheduleBuilder> {
    return this.service.findOneById(schoolYearId);
  }

  @Mutation((returns) => ScheduleBuilder, { name: 'createOrUpdateScheduleBuilder' })
  async createOrUpdateScheduleBuilder(
    @Args({ name: 'scheduleBuilderInput'}) scheduleBuilderInput: CreateScheduleBuilderInput,
  ): Promise<ScheduleBuilder> {
    return this.service.createOrUpdate(scheduleBuilderInput);
  }
}
