import { Field, InputType } from '@nestjs/graphql';
import { LearningLogQuestion } from '../models/learning-log-question.entity';

@InputType()
export class LearningLogQuestionInput {
  @Field(() => LearningLogQuestion)
  question = null;
}
