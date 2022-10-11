import { Args, ID, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { SchoolYearsService } from '../services/schoolyear.service';
import { PeriodService } from '../services/period.service';

@Resolver((of) => SchoolYear)
export class SchoolYearResolver {
  constructor(private schoolYearsService: SchoolYearsService, private periodService: PeriodService) {}

  @Query((returns) => SchoolYear, { name: 'getSchoolYear' })
  async getSchoolYear(@Args({ name: 'school_year_id', type: () => ID }) school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(school_year_id);
  }
  @Query((returns) => [SchoolYear], { name: 'getSchoolYearAll' })
  async getSchoolYearAll(): Promise<SchoolYear[]> {
    return this.schoolYearsService.findAll();
  }

  @Query((returns) => [SchoolYear], { name: 'getActiveSchoolYears' })
  async getActiveSchoolYears(@Args({ name: 'region_id', type: () => ID }) region_id: number): Promise<SchoolYear[]> {
    return this.schoolYearsService.findActiveSchoolYears(region_id);
  }

  @Query((returns) => [SchoolYear], { name: 'getSchoolYearsByRegionId' })
  async getSchoolYearsByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<SchoolYear[]> {
    return this.schoolYearsService.findSchoolYearsByRegionId(region_id);
  }

  @Query((returns) => SchoolYear, { name: 'getCurrentSchoolYear' })
  async getCurrentSchoolYear(): Promise<SchoolYear> {
    return this.schoolYearsService.getCurrent();
  }

  @Mutation((of) => SchoolYear, { name: 'createSchoolYear' })
  @UseGuards(new AuthGuard())
  async createSchoolYear(
    @Args('createSchoolYearInput') createSchoolYearInput: CreateSchoolYearInput,
    @Args('previousYearId') previousYearId?: number,
  ): Promise<SchoolYear> {
    const response = await this.schoolYearsService.createSchoolYear(createSchoolYearInput, previousYearId);
    // clone schedulebuilder(already done) and period
    if (createSchoolYearInput.cloneSchoolYearId) {
      const previousPeriods = await this.periodService.findPeriodByIds(createSchoolYearInput.cloneSchoolYearId);
      for (let i = 0; i < previousPeriods.length; i++) {
        const clonePeriod = previousPeriods[i];
        const {
          school_year_id,
          period,
          category,
          grade_level_min,
          grade_level_max,
          reduce_funds,
          price,
          semester,
          message_semester,
          message_period,
          notify_semester,
          notify_period,
          archived,
        } = clonePeriod;
        const newOne = await this.periodService.upsert({
          school_year_id: response.school_year_id,
          period,
          category,
          grade_level_min,
          grade_level_max,
          reduce_funds,
          price,
          semester,
          message_semester,
          message_period,
          notify_semester,
          notify_period,
          archived,
        });
      }
    }
    return response;
  }

  @Mutation((of) => SchoolYear, { name: 'updateSchoolYear' })
  @UseGuards(new AuthGuard())
  async updateSchoolYear(
    @Args('updateSchoolYearInput') updateSchoolYearInput: UpdateSchoolYearInput,
  ): Promise<SchoolYear> {
    const response = await this.schoolYearsService.updateSchoolYear(updateSchoolYearInput);
    return response;
  }

  // @ResolveReference()
  // resolveReference(reference: {
  //   __typename: string;
  //   school_year_id: number;
  // }): Promise<SchoolYear> {
  //   return this.schoolYearsService.findOneById(reference.school_year_id);
  // }
}
