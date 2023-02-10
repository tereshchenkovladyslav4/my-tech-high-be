import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateHomeroomSettingInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => Int, { nullable: true })
  days_to_submit_early: number;

  @Field(() => Int, { nullable: true })
  max_of_excused_learning_logs_allowed: number;

  @Field(() => Int, { nullable: true })
  grading_scale_percentage: number;

  @Field(() => Int, { nullable: true })
  passing_average: number;

  @Field(() => Boolean, { nullable: true })
  grades_by_subject: boolean;

  @Field(() => Boolean, { nullable: true })
  notify_when_graded: boolean;

  @Field(() => Boolean, { nullable: true })
  update_required_schedule_to_sumbit: boolean;

  @Field(() => Boolean, { nullable: true })
  notify_when_resubmit_required: boolean;

  @Field(() => Boolean, { nullable: true })
  gender: boolean;

  @Field(() => Boolean, { nullable: true })
  special_education: boolean;

  @Field(() => Boolean, { nullable: true })
  diploma: boolean;

  @Field(() => Boolean, { nullable: true })
  zero_count: boolean;
}
