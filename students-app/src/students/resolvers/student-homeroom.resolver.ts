import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Parent } from '../models/parent.entity';
import { HomeroomStudent } from '../models/homeroom-student.entity';
import { StudentHomeroomService } from '../services/student-homeroom.service';

@Resolver((of) => HomeroomStudent)
export class StudentHomeroomResolver {
  constructor(private studentHomeroomService: StudentHomeroomService) {}

  @Query((returns) => HomeroomStudent, { name: 'studentHomeroomInfo' })
  async getStudentHomeroomInfo(
    @Args({ name: 'student_id', type: () => Int }) student_id: number,
    @Args({ name: 'school_year_id', type: () => Int }) school_year_id: number,
  ): Promise<Parent> {
    return this.studentHomeroomService.findOneById(student_id, school_year_id);
  }
}
