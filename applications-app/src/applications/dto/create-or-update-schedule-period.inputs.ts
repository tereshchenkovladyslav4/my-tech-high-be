import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { SchedulePeriodStatus } from '../enums';

@InputType()
export class CreateOrUpdateSchedulePeriodInput {
  @Field(() => Int, { nullable: true })
  schedule_period_id?: number | null;

  @Field(() => Int, { nullable: true })
  ScheduleId: number;

  @Field(() => Int, { nullable: true })
  PeriodId: number;

  @Field(() => Int, { nullable: true })
  SubjectId: number;

  @Field(() => Int, { nullable: true })
  TitleId: number;

  @Field(() => Int, { nullable: true })
  ProviderId: number;

  @Field(() => Int, { nullable: true })
  CourseId: number;

  @Field(() => String, { nullable: true })
  course_type: string;

  @Field(() => String, { nullable: true })
  custom_build_description: string;

  @Field(() => String, { nullable: true })
  tp_provider_name: string;

  @Field(() => String, { nullable: true })
  tp_course_name: string;

  @Field(() => String, { nullable: true })
  tp_phone_number: string;

  @Field(() => String, { nullable: true })
  tp_specific_course_website: string;

  @Field(() => String, { nullable: true })
  tp_additional_specific_course_website: string;

  @Field(() => String, { nullable: true })
  osse_course_name: string;

  @Field(() => String, { nullable: true })
  osse_district_school: string;

  @Field(() => String, { nullable: true })
  osse_school_district_name: string;

  @Field(() => Boolean, { nullable: true })
  update_required?: boolean;

  @Field(() => SchedulePeriodStatus, { nullable: true })
  status: SchedulePeriodStatus;
}

@InputType()
export class schedulePeriodInput {
  @Field(() => [CreateOrUpdateSchedulePeriodInput], { nullable: true })
  param: CreateOrUpdateSchedulePeriodInput[] | [];
}
