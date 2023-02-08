import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EnrollmentQuestionsInput {
  @Field(() => Int)
  region_id?: number;

  @Field(() => Int, { nullable: true })
  school_year_id?: number;

  @Field(() => Boolean, { nullable: true })
  mid_year?: boolean;
}
