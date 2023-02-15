import { Args, ID, Query, Resolver, ResolveReference, Int } from '@nestjs/graphql';
import { SchoolYear } from '../models/schoolyear.entity';
import { SchoolYearsService } from '../services/schoolyears.service';

@Resolver(() => SchoolYear)
export class SchoolYearResolver {
  constructor(private schoolYearsService: SchoolYearsService) {}

  @Query(() => SchoolYear, { name: 'schoolyear' })
  async getSchoolYear(@Args({ name: 'school_year_id', type: () => ID }) school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(school_year_id);
  }

  @Query(() => [SchoolYear], { name: 'schoolyear_all' })
  async getSchoolYearAll(): Promise<SchoolYear[]> {
    return this.schoolYearsService.findAll();
  }

  @Query(() => [SchoolYear], { name: 'activeHomeroomResourceSchoolYears' })
  async getActiveHomeroomResourceSchoolYears(
    @Args('studentId', { type: () => Int }) studentId: number,
  ): Promise<SchoolYear[]> {
    return this.schoolYearsService.getActiveHomeroomResourceSchoolYears(studentId);
  }

  @Query(() => [SchoolYear], { name: 'activeScheduleSchoolYears' })
  async getActiveScheduleSchoolYears(@Args('studentId', { type: () => Int }) studentId: number): Promise<SchoolYear[]> {
    return this.schoolYearsService.getActiveScheduleSchoolYears(studentId);
  }

  @Query(() => [SchoolYear], { name: 'activeHomeroomSchoolYears' })
  async getActiveHomeroomSchoolYears(@Args('studentId', { type: () => Int }) studentId: number): Promise<SchoolYear[]> {
    return this.schoolYearsService.getActiveHomeroomSchoolYears(studentId);
  }

  @Query(() => [SchoolYear], { name: 'reimbursementRequestSchoolYears' })
  async getReimbursementRequestSchoolYears(
    @Args('regionId', { type: () => Int }) regionId: number,
  ): Promise<SchoolYear[]> {
    return this.schoolYearsService.getReimbursementRequestSchoolYears(regionId);
  }

  @Query(() => SchoolYear, { name: 'schoolyear_getcurrent' })
  async getCurrent(@Args('region_id', { type: () => Int }) region_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.getCurrent(region_id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; school_year_id: number }): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(reference.school_year_id);
  }
}
