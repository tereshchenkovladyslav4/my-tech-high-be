import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Question } from 'src/models/question.entity';
import { QuestionInput } from 'src/users/dto/question.input';
import { QuestionService } from 'src/users/services/question.service';
import { WithdrawQuestionInput } from '../dto/withdraw-question.input';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private service: QuestionService) {}

  @Query(() => [Question], { name: 'questionsByRegion' })
  questionsByRegion(
    @Args('withdrawQuestionInput')
    withdrawQuestionInput: WithdrawQuestionInput,
  ): Promise<Question[]> {
    return this.service.findByRegion(withdrawQuestionInput);
  }

  @Mutation(() => Boolean, { name: 'saveQuestions' })
  async saveQuestions(
    @Args('questionsInput', { type: () => [QuestionInput] })
    questions: QuestionInput[],
  ): Promise<boolean> {
    try {
      await Promise.all(questions.map((el) => this.service.save(el.question)));
      return true;
    } catch (e) {
      console.error('saveQuestions', e);
      return false;
    }
  }

  @Mutation(() => Int, { name: 'deleteQuestion' })
  async deleteQuestion(@Args('question_id', { type: () => Int }) id: number): Promise<number> {
    return await this.service.delete(id);
  }
}
