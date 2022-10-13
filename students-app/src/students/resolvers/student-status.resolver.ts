import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusService } from '../services/student-status.service';

@Resolver((of) => StudentStatus)
export class StudentStatusResolver {
  constructor(private readonly studentStatusService: StudentStatusService) {}

  @Query((returns) => StudentStatus, { name: 'status' })
  async getParent(@Args({ name: 'student_id', type: () => ID }) student_id: number): Promise<StudentStatus> {
    return this.studentStatusService.findOneById(student_id);
  }
}
