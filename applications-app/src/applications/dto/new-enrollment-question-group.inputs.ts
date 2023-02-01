import { Field, InputType, Int } from '@nestjs/graphql';
import { NewEnrollmentQuestionsInput } from './new-enrollment-questions.inputs';

@InputType()
export class NewEnrollmentQuestionGroupInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  tab_id?: number;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  group_name: string;

  @Field(() => [NewEnrollmentQuestionsInput], { defaultValue: [] })
  questions?: NewEnrollmentQuestionsInput[];

  @Field(() => String, { nullable: true })
  school_year_id?: string;
}
