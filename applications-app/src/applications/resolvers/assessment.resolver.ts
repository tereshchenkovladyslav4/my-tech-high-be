import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Assessment } from '../models/assessment.entity';
import { AssessmentService } from '../services/assessment.service';
import { CreateOrUpdateAssessmentInput, UpdateAssessmentInputs } from '../dto/create-or-update-assessment.inputs';

@Resolver(() => Assessment)
export class AssessmentResolver {
  constructor(private service: AssessmentService) {}

  @Query(() => [Assessment], { name: 'getAssessmentsBySchoolYearId' })
  @UseGuards(new AuthGuard())
  get(@Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number): Promise<Assessment[]> {
    return this.service.find(schoolYearId);
  }

  @Mutation(() => Assessment, { name: 'createOrUpdateAssessment' })
  @UseGuards(new AuthGuard())
  async createOrUpdateAssessment(
    @Args('assessmentInput')
    assessmentInput: CreateOrUpdateAssessmentInput,
  ): Promise<Assessment> {
    return this.service.save(assessmentInput);
  }

  @Mutation(() => [Assessment], { name: 'updateAssessments' })
  @UseGuards(new AuthGuard())
  async updateAssessments(
    @Args('updateAssessmentsInputs')
    updateAssessmentsInputs: UpdateAssessmentInputs,
  ): Promise<Assessment[]> {
    return this.service.updates(updateAssessmentsInputs);
  }

  @Mutation(() => Boolean, { name: 'deleteAssessment' })
  @UseGuards(new AuthGuard())
  async deleteResource(
    @Args({ name: 'assessment_id', type: () => ID })
    assessment_id: number,
  ): Promise<boolean> {
    return this.service.delete(assessment_id);
  }
}
