import { Args, Resolver, Query, ResolveField, Parent as TypeParent, ID } from '@nestjs/graphql';
import { EnrollmentQuestionsService } from '../services/enrollment-questions.service';
import { EnrollmentQuestionGroup } from '../models/enrollment-question-group.entity';
import { EnrollmentQuestions } from '../models/enrollment-questions.entity';
@Resolver(() => EnrollmentQuestionGroup)
export class EnrollmentQuestionGroupResolver {
  constructor(private service: EnrollmentQuestionsService) {}

  @ResolveField(() => [EnrollmentQuestions], { name: 'questions' })
  public async getQuestions(@TypeParent() parent: EnrollmentQuestionGroup): Promise<EnrollmentQuestions[]> {
    return this.service.findOneByParent(parent.id);
  }

  @Query(() => [EnrollmentQuestions], { name: 'getEnrollmentQuestionsBySlugAndRegion' })
  public async getEnrollmentQuestionsBySlugAndRegion(
    @Args({ name: 'regionId', type: () => ID }) regionId: number,
    @Args({ name: 'slug', type: () => String }) slug: string,
  ): Promise<Array<EnrollmentQuestions>> {
    return this.service.findEnrollmentQuesBySlugAndRegion(regionId, slug);
  }
}
