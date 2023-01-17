import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class SchedulesArgs {
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

  @Field(() => ScheduleFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('ScheduleFilters')
export class ScheduleFilters {
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

  @Field(() => [Int])
  curriculumProviders = [];

  @Field(() => Int)
  selectedYearId = null;
}
