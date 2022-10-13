import { Args, ID, Query, Resolver, ResolveReference, ResolveField, Parent, Int } from '@nestjs/graphql';
import { SchoolYear } from '../models/schoolyear.entity';
import { SchoolYearsService } from '../services/schoolyears.service';

@Resolver((of) => SchoolYear)
export class SchoolYearResolver {
  constructor(private schoolYearsService: SchoolYearsService) {}

  @Query((returns) => SchoolYear, { name: 'schoolyear' })
  async getSchoolYear(@Args({ name: 'school_year_id', type: () => ID }) school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(school_year_id);
  }
  @Query((returns) => [SchoolYear], { name: 'schoolyear_all' })
  async getSchoolYearAll(): Promise<SchoolYear[]> {
    return this.schoolYearsService.findAll();
  }

  @Query((returns) => SchoolYear, { name: 'schoolyear_getcurrent' })
  async getCurrent(@Args('region_id', { type: () => Int }) region_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.getCurrent(region_id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; school_year_id: number }): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(reference.school_year_id);
  }
}
