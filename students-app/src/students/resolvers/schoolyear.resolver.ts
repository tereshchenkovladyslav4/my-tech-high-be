import { Args, ID, Query, Resolver, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { SchoolYear } from '../models/schoolyear.entity';
import { SchoolYearsService } from '../services/schoolyears.service';

@Resolver((of) => SchoolYear)
export class SchoolYearResolver {
  constructor(
    private schoolYearsService: SchoolYearsService
    ) {}

  @Query((returns) => SchoolYear, { name: 'schoolyear' })
  async getSchoolYear(@Args({ name: 'school_year_id', type: () => ID }) school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(school_year_id);
  }

  @Query((returns) => SchoolYear, { name: 'schoolyear_getcurrent' })
  async getCurrent(): Promise<SchoolYear> {
    return this.schoolYearsService.getCurrent();
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; school_year_id: number }): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(reference.school_year_id);
  }
}
