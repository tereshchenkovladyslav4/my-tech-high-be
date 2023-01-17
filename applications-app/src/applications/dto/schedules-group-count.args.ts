import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class SchedulesGroupCountArgs {
  @Field(() => Int)
  region_id: number;

  @Field(() => ScheduleGroupFilters)
  filter = null;
}

@InputType('ScheduleGroupFilters')
export class ScheduleGroupFilters {
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
