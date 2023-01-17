import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { StudentAssessmentOption } from '../models/student-assessment-option.entity';
import { StudentAssessmentService } from '../services/student-assessment.service';
import { CreateOrUpdateStudentAssessmentInput } from '../dto/create-or-update-student-assessment.inputs';

@Resolver(() => StudentAssessmentOption)
export class StudentAssessmentResolver {
  constructor(private service: StudentAssessmentService) {}

  @Query(() => [StudentAssessmentOption], { name: 'getStudentAssessmentsByStudentId' })
  @UseGuards(new AuthGuard())
  get(@Args({ name: 'student_id', type: () => ID }) student_id: number): Promise<StudentAssessmentOption[]> {
    return this.service.find(student_id);
  }

  @Mutation(() => StudentAssessmentOption, { name: 'createOrUpdateStudentAssessment' })
  @UseGuards(new AuthGuard())
  async createOrUpdateStudentAssessment(
    @Args('studentAssessmentInput')
    studentAssessmentInput: CreateOrUpdateStudentAssessmentInput,
  ): Promise<StudentAssessmentOption> {
    return this.service.save(studentAssessmentInput);
  }
}
