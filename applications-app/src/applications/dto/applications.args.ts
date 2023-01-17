import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ApplicationsArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(() => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field(() => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field(() => ApplicationFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('ApplicationFilters')
export class ApplicationFilters {
  @Field(() => [String])
  grades = [];

  @Field(() => [String])
  schoolYear = [];

  @Field(() => [String])
  specialEd = [];

  @Field(() => [String])
  status = [];

  @Field(() => [String])
  accountStatus = [];

  @Field(() => [String])
  visibility = [];

  @Field(() => Int)
  diplomaSeeking = null;

  @Field(() => [String])
  courseType = [];

  @Field(() => [String])
  curriculumProviders = [];

  @Field(() => Int)
  selectedYearId = null;
}
