import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

import { LearningLogQuestion } from '../models/learning-log-question.entity';
import { LearningLogQuestionService } from '../services/learning-log-question.service';
import { CreateOrUpdateLearningLogQuestionInput } from '../dto/create-or-update-learninglog-question.input';

@Resolver((of) => LearningLogQuestion)
export class LearningLogQuestionResolver {
  constructor(private service: LearningLogQuestionService) { }

  @Mutation((returns) => Boolean, { name: 'createOrUpdateLearningLogQuestion' })
  @UseGuards(new AuthGuard())
  async createOrUpdateLearningLogQuestion(
    @Args('createOrUpdateLearningLogQuestionInput', { type: () => [CreateOrUpdateLearningLogQuestionInput] })
    createOrUpdateLearningLogQuestionInput: CreateOrUpdateLearningLogQuestionInput[],
  ): Promise<Boolean> {
    return this.service.save(createOrUpdateLearningLogQuestionInput);
  }

  @Query((returns) => [LearningLogQuestion], { name: 'getLearningLogQuestionByAssignmentId' })
  @UseGuards(new AuthGuard())
  async getLearningLogQuestionByAssignmentId(
    @Args('assignmentId', { type: () => Int }) assignmentId: number,
  ): Promise<LearningLogQuestion[]> {
    return this.service.get(assignmentId);
  }
}
