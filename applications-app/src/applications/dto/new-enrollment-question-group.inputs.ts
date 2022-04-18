import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
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

  @Field((type) => [NewEnrollmentQuestionsInput], { defaultValue: [] })
  questions?: NewEnrollmentQuestionsInput[];
}
