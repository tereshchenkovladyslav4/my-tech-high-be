import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { SchoolYearsService } from '../services/schoolyear.service';

@Resolver((of) => SchoolYear)
export class SchoolYearResolver {
  constructor(private schoolYearsService: SchoolYearsService) {}

  @Query((returns) => SchoolYear, { name: 'getSchoolYear' })
  async getSchoolYear(
    @Args({ name: 'school_year_id', type: () => ID }) school_year_id: number,
  ): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(school_year_id);
  }
  @Query((returns) => [SchoolYear], { name: 'getSchoolYearAll' })
  async getSchoolYearAll(): Promise<SchoolYear[]> {
    return this.schoolYearsService.findAll();
  }
  @Query((returns) => SchoolYear, { name: 'getCurrentSchoolYear' })
  async getCurrentSchoolYear(): Promise<SchoolYear> {
    return this.schoolYearsService.getCurrent();
  }

  @Mutation((of) => SchoolYear, { name: 'createSchoolYear' })
  @UseGuards(new AuthGuard())
  async createSchoolYear(
    @Args('createSchoolYearInput') createSchoolYearInput: CreateSchoolYearInput,
  ): Promise<SchoolYear> {
    const response = this.schoolYearsService.createSchoolYear(
      createSchoolYearInput,
    );
    return response;
  }

  @Mutation((of) => SchoolYear, { name: 'updateSchoolYear' })
  @UseGuards(new AuthGuard())
  async updateSchoolYear(
    @Args('updateSchoolYearInput') updateSchoolYearInput: UpdateSchoolYearInput,
  ): Promise<SchoolYear> {
    const response = await this.schoolYearsService.updateSchoolYear(
      updateSchoolYearInput,
    );
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
