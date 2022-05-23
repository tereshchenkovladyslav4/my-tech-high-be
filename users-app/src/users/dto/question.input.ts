import { Field, InputType, Int } from '@nestjs/graphql';
import { Question } from 'src/models/question.entity';

@InputType()
export class QuestionInput {
  @Field((type) => Question)
  question = null;
}
