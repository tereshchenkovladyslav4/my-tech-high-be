import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min, IsOptional } from 'class-validator';

@ArgsType()
export class SchedulesArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field((type) => ScheduleFilters)
  filter = null;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('ScheduleFilters')
export class ScheduleFilters {
  @Field((type) => [String])
  grades = [];

  @Field((type) => [String])
  schoolYear = [];

  @Field((type) => [String])
  specialEd = [];

  @Field((type) => [String])
  status = [];

  @Field((type) => [String])
  accountStatus = [];

  @Field((type) => [String])
  visibility = [];

  @Field((type) => Int)
  diplomaSeeking = null;

  @Field((type) => [String])
  courseType = [];

  @Field((type) => [String])
  curriculumProviders = [];

  @Field((type) => Int)
  selectedYearId = null;
}
