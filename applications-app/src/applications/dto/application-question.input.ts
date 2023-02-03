import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class ApplicatinQuestionsInput {
  @Field(() => Int)
  region_id?: number;

  @Field(() => Boolean)
  mid_year?: boolean;

  @Field(() => Int)
  school_year_id?: number;
}
