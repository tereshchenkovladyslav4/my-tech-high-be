import {
  Args,
  Resolver,
  Mutation,
  Query,
  Int,
  ResolveField,
  Parent as TypeParent,
} from '@nestjs/graphql';
import { EnrollmentQuestionTab } from '../models/enrollment-question-tab.entity';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { EnrollmentQuestionTabService } from '../services/enrollment-question-tab.service';
import { NewEnrollmentQuestionsInput } from '../dto/new-enrollment-questions.inputs';
import { EnrollmentQuestionsService } from '../services/enrollment-questions.service';
import { EnrollmentQuestionGroupService } from '../services/enrollment-question-group.service';
import { EnrollmentQuestionGroup } from '../models/enrollment-question-group.entity';
import { EnrollmentQuestions } from '../models/enrollment-questions.entity';
@Resolver((of) => EnrollmentQuestionGroup)
export class EnrollmentQuestionGroupResolver {
  constructor(
    private service: EnrollmentQuestionsService,
    private enrollmentQuestionGroupService: EnrollmentQuestionGroupService,
  ) {}

  @ResolveField((of) => [EnrollmentQuestions], { name: 'questions' })
  public async getQuestions(
    @TypeParent() parent: EnrollmentQuestionGroup,
  ): Promise<EnrollmentQuestions[]> {
    return this.service.findOneByParent(parent.id);
  }
}
