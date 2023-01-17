import { Args, Resolver, Query, Mutation, ID, Int } from '@nestjs/graphql';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

import { Period } from 'src/models/period.entity';
import { PeriodInput } from '../dto/period.inputs';
import { DeleteRes } from '../dto/delete-res';
import { PeriodService } from '../services/period.service';
import { DeleteResult } from 'typeorm';

@Resolver(() => Period)
export class PeriodResolver {
  constructor(private service: PeriodService) {}
  // ===========================================================================================================
  // GET
  @Query(() => [Period], { name: 'periods' })
  @UseGuards(new AuthGuard())
  get(
    @Args({ name: 'school_year_id', type: () => ID }) school_year_id: number,
    @Args({ name: 'archived', type: () => Boolean, nullable: true }) archived: boolean,
    @Args({ name: 'keyword', type: () => String, nullable: true }) keyword: string,
  ): Promise<Period[]> {
    return this.service.find(school_year_id, archived, keyword);
  }
  // ===========================================================================================================
  // GET: Saved Period indexes (0 - max_num_periods)
  @Query(() => [Number], { name: 'periodIds' })
  @UseGuards(new AuthGuard())
  periodIds(@Args({ name: 'school_year_id', type: () => ID }) school_year_id: number): Promise<number[]> {
    return this.service.findIds(school_year_id);
  }

  // ===========================================================================================================
  // upsert
  @Mutation(() => Period, { name: 'periodUpsert' })
  @UseGuards(new AuthGuard())
  async upsertPeriod(@Args({ name: 'PeriodInput' }) args: PeriodInput): Promise<Period> {
    return this.service.upsert(args);
  }

  // ===========================================================================================================
  // toggle archived
  @Mutation(() => Period, { name: 'periodArchive' })
  @UseGuards(new AuthGuard())
  async setArchive(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'archived', type: () => Boolean }) archived: boolean,
  ): Promise<Period> {
    return this.service.setArchived(id, archived);
  }
  // ===========================================================================================================
  // Delete
  @Mutation(() => DeleteRes, { name: 'periodDeleteByIds' })
  @UseGuards(new AuthGuard())
  async deleteByIds(@Args({ name: 'ids', type: () => [ID] }) ids: number[]): Promise<DeleteResult> {
    return this.service.deleteByIds(ids);
  }
}
