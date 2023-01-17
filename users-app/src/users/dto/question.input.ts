import { Field, InputType } from '@nestjs/graphql';
import { Question } from 'src/models/question.entity';

@InputType()
export class QuestionInput {
  @Field(() => Question)
  question = null;
}
