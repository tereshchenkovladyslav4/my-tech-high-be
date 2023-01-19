import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ReimbursementQuestion } from '../models/reimbursement-question.entity';
import { ReimbursementQuestionService } from '../services/reimbursement-question.service';
import { ReimbursementFormType } from '../enums';
import { CreateOrUpdateReimbursementQuestionsInput } from '../dto/create-or-update-reimbursement-question.inputs';

@Resolver(() => ReimbursementQuestion)
export class ReimbursementQuestionResolver {
  constructor(private service: ReimbursementQuestionService) {}

  @Query(() => [ReimbursementQuestion], { name: 'reimbursementQuestions' })
  @UseGuards(new AuthGuard())
  getReimbursementQuestions(
    @Args({ name: 'schoolYearId', type: () => Int }) schoolYearId: number,
    @Args({ name: 'reimbursementFormType', type: () => ReimbursementFormType })
    reimbursementFormType: ReimbursementFormType,
    @Args({ name: 'isDirectOrder', type: () => Boolean }) isDirectOrder: boolean,
  ): Promise<ReimbursementQuestion[]> {
    return this.service.findBySchoolYearIdAndFormType(schoolYearId, reimbursementFormType, isDirectOrder);
  }

  @Mutation(() => [ReimbursementQuestion], { name: 'createOrUpdateReimbursementQuestions' })
  @UseGuards(new AuthGuard())
  async createOrUpdateReimbursementQuestions(
    @Args('questionInputs')
    questionInputs: CreateOrUpdateReimbursementQuestionsInput,
  ): Promise<ReimbursementQuestion[]> {
    return this.service.save(questionInputs);
  }

  @Mutation(() => Boolean, { name: 'deleteReimbursementQuestion' })
  @UseGuards(new AuthGuard())
  async deleteReimbursementQuestion(
    @Args('remimbursement_question_id')
    remimbursement_question_id: number,
  ): Promise<boolean> {
    return this.service.delete(remimbursement_question_id);
  }
}
