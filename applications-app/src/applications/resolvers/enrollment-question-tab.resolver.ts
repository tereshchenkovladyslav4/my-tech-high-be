import { Args, Resolver, Mutation, Query, Int, ResolveField, Parent as TypeParent } from '@nestjs/graphql';
import { EnrollmentQuestionTab } from '../models/enrollment-question-tab.entity';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { EnrollmentQuestionTabService } from '../services/enrollment-question-tab.service';
import { NewEnrollmentQuestionTabInput } from '../dto/new-enrollment-question-tab.inputs';
import { EnrollmentQuestionsService } from '../services/enrollment-questions.service';
import { EnrollmentQuestionGroupService } from '../services/enrollment-question-group.service';
import { EnrollmentQuestionGroup } from '../models/enrollment-question-group.entity';
@Resolver(() => EnrollmentQuestionTab)
export class EnrollmentQuestionTabResolver {
  constructor(
    private service: EnrollmentQuestionTabService,
    private enrollmentQuestionGroupService: EnrollmentQuestionGroupService,
    private enrollmentQuestionsService: EnrollmentQuestionsService,
  ) {}
  @ResolveField(() => [EnrollmentQuestionGroup], { name: 'groups' })
  public async getGroups(@TypeParent() parent: EnrollmentQuestionTab): Promise<EnrollmentQuestionGroup[]> {
    return await this.enrollmentQuestionGroupService.findOneByParent(parent.id);
  }

  @Query(() => [EnrollmentQuestionTab], { name: 'getEnrollmentQuestions' })
  public async getEnrollmentQuestionTabs(
    @Args('input', { nullable: true }) input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionTab[]> {
    return this.service.find(input);
  }

  @Query(() => [EnrollmentQuestionTab], {
    name: 'getParentEnrollmentQuestions',
  })
  public async getParentEnrollmentQuestionTabs(
    @Args('input', { nullable: true }) input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionTab[]> {
    return this.service.findByActive(input);
  }

  @Query(() => [EnrollmentQuestionTab], {
    name: 'getPacketEnrollmentQuestions',
  })
  public async getPacketEnrollmentQuestionTabs(
    @Args('input', { nullable: true }) input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionTab[]> {
    return this.service.findByAdmin(input);
  }

  @Mutation(() => Boolean, {
    name: 'saveEnrollmentQuestions',
  })
  async updateCreateEnrollmentQuestions(
    @Args('data', { type: () => [NewEnrollmentQuestionTabInput] })
    data: NewEnrollmentQuestionTabInput[],
  ): Promise<boolean> {
    try {
      for (const el of data) {
        await this.service.createOrUpdate(el);
      }
      return true;
    } catch (e) {
      console.error('saveEnrollmentQuestion', e);
      return false;
    }
  }

  @Mutation(() => Int, { name: 'deleteEnrollmentQuestions' })
  async deleteEnrollmentQuestions(@Args('id', { type: () => Int }) id: number): Promise<number> {
    return await this.enrollmentQuestionsService.deleteEnrollment(id);
  }

  @Mutation(() => Int, { name: 'deleteEnrollmentQuestionGroup' })
  async deleteEnrollmentQuestionGroup(@Args('id', { type: () => Int }) id: number): Promise<number> {
    return await this.enrollmentQuestionGroupService.deleteEnrollment(id);
  }
}
