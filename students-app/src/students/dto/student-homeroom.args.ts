import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { YEAR_STATUS } from '../enums/year-status.enum';

@ArgsType()
export class StudentsHomeroomArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(-1)
  @Max(50)
  take = 25;

  @Field((type) => String)
  sort = 'ASC';

  @Field((type) => String)
  search = '';

  @Field((type) => StudentHomeroomFilters)
  filter = null;
}

@InputType('StudentHomeroomFilters')
export class StudentHomeroomFilters {
  @Field((type) => String)
  region_id = '';

  @Field((type) => Int)
  schoolYear = 1;

  @Field((type) => [String])
  grades = [];

  // @Field((type) => [String])
  // previousSOE = [];

  // @Field((type) => [String])
  // schoolOfEnrollments = [];

  // @Field((type) => [String])
  // schoolDistrict = [];

  // @Field((type) => [YEAR_STATUS])
  // yearStatus = [];

  // @Field((type) => [Int])
  // curriculumProviders = [];
  // @Field((type) => [String])
  // status = [];
}
