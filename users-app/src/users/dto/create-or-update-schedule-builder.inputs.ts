import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateScheduleBuilderInput {
  @Field(() => Int)
  max_num_periods: number;

  @Field(() => Int)
  custom_built: number;

  @Field(() => Int)
  split_enrollment: number;

  @Field({ nullable: true })
  split_enrollment_grades?: string;

  @Field(() => Int)
  always_unlock: number;

  @Field(() => String)
  parent_tooltip: string;

  @Field(() => Int)
  third_party_provider: number;

  @Field(() => Int)
  school_year_id?: number;

  @Field(() => Int, { nullable: true })
  id?: number;
}
