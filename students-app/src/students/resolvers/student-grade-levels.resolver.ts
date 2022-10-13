import { Args, ID, Query, Resolver, ResolveReference, Int, ResolveField, Parent as TypeParent } from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { Person } from '../models/person.entity';
import { Parent } from '../models/parent.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentsService } from '../services/students.service';
import { StudentsArgs } from '../dto/student.args';
import { PersonsService } from '../services/persons.service';
import { ParentsService } from '../services/parents.service';
import { StudentGradeLevelsService } from '../services/student-grade-levels.service';
import { StudentGradeLevelsArgs } from '../dto/student-grade-level.args';
import { SchoolYear } from '../models/schoolyear.entity';
import { SchoolYearsService } from '../services/schoolyears.service';

@Resolver((of) => StudentGradeLevel)
export class StudentGradeLevelsResolver {
  constructor(
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private schoolYearsService: SchoolYearsService,
  ) {}

  @Query((returns) => [StudentGradeLevel], { name: 'student_grade_levels' })
  async getStudentGradeLevels(@Args() studentGradeLevelsArgs: StudentGradeLevelsArgs): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsService.findAll(studentGradeLevelsArgs);
  }

  @ResolveField((of) => SchoolYear, { name: 'school_year' })
  public async getStudentGradeLevelSchoolYear(@TypeParent() studentGradeLevel: StudentGradeLevel): Promise<SchoolYear> {
    return this.schoolYearsService.findOneById(studentGradeLevel.school_year_id);
  }
}
