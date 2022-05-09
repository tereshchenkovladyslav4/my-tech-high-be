import { Args, Resolver, Mutation, Query, Int } from '@nestjs/graphql';
import { ApplicationQuestion } from '../models/application-question.entity';
import { ApplicatinQuestionsInput } from '../dto/application-question.input';
import { ApplicationQuestionsService } from '../services/application-questions.service';
import { NewApplicationQuestionsInput } from '../dto/new-application-questions.input';

@Resolver(() => ApplicationQuestion)
export class ApplicationQuestionsResolver {
  constructor(private service: ApplicationQuestionsService) {}

  @Query(() => [ApplicationQuestion], { name: 'getApplicationQuestions' })
  public async getApplicationQuestions(
    @Args('input', { nullable: true }) input?: ApplicatinQuestionsInput,
  ): Promise<ApplicationQuestion[]> {
    return this.service.find(input);
  }

  @Query(() => [ApplicationQuestion], { name: 'getExistApplicationQuestions' })
  public async getExistApplicationQuestions(
    @Args('input', { nullable: true }) input?: ApplicatinQuestionsInput,
  ): Promise<ApplicationQuestion[]> {
    return this.service.findExist(input);
  }

  @Mutation((returns) => Boolean, {
    name: 'saveApplicationQuestions',
  })
  async updateCreateStudentImmunization(
    @Args('data', { type: () => [NewApplicationQuestionsInput] })
    data: NewApplicationQuestionsInput[],
  ): Promise<boolean> {
    try {
      await Promise.all(data.map((el) => this.service.createOrUpdate(el)));
      return true;
    } catch (e) {
      console.error('saveApplicationQuestion', e);
      return false;
    }
  }

  @Mutation(() => Int, { name: 'deleteApplicationQuestion' })
  async deleteApplicationQuestion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return await this.service.deleteApplication(id);
  }
}
