import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EnrollmentQuestionsInput {
  @Field(() => Int)
  region_id?: number;

  @Field(() => Int)
  school_year_id?: number;

  @Field(() => Boolean)
  mid_year?: boolean;
}
