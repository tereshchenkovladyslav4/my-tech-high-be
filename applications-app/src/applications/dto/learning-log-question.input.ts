import { Field, InputType, Int } from '@nestjs/graphql';
import { LearningLogQuestion } from '../models/learning-log-question.entity';

@InputType()
export class LearningLogQuestionInput {
  @Field((type) => LearningLogQuestion)
  question = null;
}
