import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { StudentLearningLog } from '../models/student-learning-log.entity';
import { StudentLearningLogService } from '../services/student-learning-log.service';
import { CreateOrUpdateStudentLearningLogInput } from '../dto/create-or-update-student-learning-log.inputs';
import { StudentLearningLogPagination } from '../models/student-learning-log-pagination.entity';
import { Pagination } from 'src/paginate';
import { StudentLearningLogArgs } from '../dto/student-learning-log.args';
import { Assignment } from '../models/assignment.entity';

@Resolver(() => StudentLearningLog)
export class StudentLearningLogResolver {
  constructor(private service: StudentLearningLogService) {}

  @Query(() => StudentLearningLogPagination, { name: 'learningLogsForStudent' })
  @UseGuards(new AuthGuard())
  async getLearningLogsForStudent(
    @Args() studentLearningLogArgs: StudentLearningLogArgs,
  ): Promise<Pagination<Assignment> | null> {
    return this.service.findLearningLogsForStudent(studentLearningLogArgs);
  }

  @Mutation(() => StudentLearningLog, { name: 'createOrUpdateStudentLearningLog' })
  @UseGuards(new AuthGuard())
  async createOrUpdateStudentLearningLog(
    @Args('createStudentLearningLogInput')
    createStudentLearningLogInput: CreateOrUpdateStudentLearningLogInput,
  ): Promise<StudentLearningLog> {
    return this.service.save(createStudentLearningLogInput);
  }
}
