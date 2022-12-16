import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class SchedulesGroupCountArgs {
  @Field(() => Int)
  region_id: number;

  @Field((type) => ScheduleGroupFilters)
  filter = null;
}

@InputType('ScheduleGroupFilters')
export class ScheduleGroupFilters {
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

  @Field((type) => [Int])
  curriculumProviders = [];

  @Field((type) => Int)
  selectedYearId = null;
}
