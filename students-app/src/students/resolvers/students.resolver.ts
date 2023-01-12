import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  ResolveField,
  Parent as TypeParent,
  Mutation,
} from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { Parent } from '../models/parent.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentGradeLevelsService } from '../services/student-grade-levels.service';
import { StudentsService } from '../services/students.service';
import { StudentsArgs } from '../dto/student.args';
import { ParentsService } from '../services/parents.service';
import { StudentCurrentStatus } from '../models/student-current-status.entity';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusHistory } from '../models/student-status-history.entity';
import { ChangeStatusInput } from '../dto/change-status.input';
import { UpdateStudentProfileInput } from '../dto/update-profile.inputs';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Pagination } from 'src/paginate';
import { StudentPagination } from '../models/student-pagination.entity';
import { assignStudentToSOEInput } from '../dto/assign-student-soe.input';
import { SchoolEnrollmentService } from '../services/school-enrollment-service.service';
import { StudentsHomeroomArgs } from '../dto/student-homeroom.args';

@Resolver((of) => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private schoolEnrollmentService: SchoolEnrollmentService,
  ) {}

  @Query((returns) => Student, { name: 'student' })
  async getStudent(@Args({ name: 'student_id', type: () => ID }) student_id: number): Promise<Student> {
    return this.studentsService.findOneById(student_id);
  }

  @Query((of) => StudentPagination, { name: 'studentsForSOE' })
  public async getStudentsForSOE(@Args() studentsArgs: StudentsArgs): Promise<Pagination<Student>> {
    return this.studentsService.findAll(studentsArgs);
  }

  @Query((of) => StudentPagination, { name: 'studentsForHoomeroom' })
  public async setStudentsForHoomeroom(@Args() studentsArgs: StudentsHomeroomArgs): Promise<Pagination<Student>> {
    return this.studentsService.findAllForHomeroom(studentsArgs);
  }

  @ResolveField((of) => Parent, { name: 'parent' })
  public async getParent(@TypeParent() student: Student): Promise<Parent> {
    return this.parentsService.findOneById(student.parent_id);
  }

  @ResolveField((of) => [StudentGradeLevel], { name: 'grade_levels' })
  public async getStudentGradeLevels(@TypeParent() student: Student): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsService.forStudents(student.student_id);
  }

  @ResolveField((of) => StudentCurrentStatus, {
    name: 'current_school_year_status',
  })
  public async getStudentCurrentStatus(@TypeParent() student: Student): Promise<StudentCurrentStatus> {
    return this.studentsService.getCurrentStatus(student);
  }

  @ResolveField((of) => [StudentStatus], { name: 'status', nullable: true })
  public async getStudentStatus(@TypeParent() student: Student): Promise<StudentStatus[]> {
    return this.studentsService.getStatus(student.student_id);
  }

  @ResolveField((of) => [StudentStatusHistory], {
    name: 'status_history',
    nullable: true,
  })
  public async getStudentStatusHistory(@TypeParent() student: Student): Promise<StudentStatusHistory[]> {
    return this.studentsService.getStatusHistory(student.student_id);
  }

  @Mutation((returns) => Boolean)
  async changeStatus(@Args('changeStatusInput') changeStatusInput: ChangeStatusInput) {
    const statudUpdated = this.studentsService.updateStatus({
      student_id: changeStatusInput.student_id,
      school_year_id: changeStatusInput.school_year_id,
      status: changeStatusInput.status,
    });
    if (!statudUpdated) return false;

    const statudUpdatedHistory = this.studentsService.updateStatusHistory({
      student_id: changeStatusInput.student_id,
      school_year_id: changeStatusInput.school_year_id,
      status: changeStatusInput.status,
    });
    if (!statudUpdatedHistory) return false;

    return true;
  }

  @Mutation((returns) => Boolean, { name: 'assignStudentToSOE' })
  @UseGuards(new AuthGuard())
  async assignStudentToSOE(
    @Args('assignStudentToSOEInput')
    assignStudentToSOEInput: assignStudentToSOEInput,
  ): Promise<boolean> {
    await this.schoolEnrollmentService.assignStudentToSOE(assignStudentToSOEInput);
    return true;
  }

  @Mutation((returns) => Student, { name: 'updateStudentProfile' })
  @UseGuards(new AuthGuard())
  async updateProfile(
    @Args('updateStudentProfileInput')
    updateStudentProfileInput: UpdateStudentProfileInput,
  ) {
    const { student_id } = updateStudentProfileInput;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) {
      throw new UnauthorizedException();
    }

    return await this.studentsService.updateProfile(student, updateStudentProfileInput);
  }

  @Mutation((returns) => Student, { name: 'removeStudentProfilePhoto' })
  @UseGuards(new AuthGuard())
  async removeProfilePhoto(
    @Args('updateStudentProfileInput')
    updateStudentProfileInput: UpdateStudentProfileInput,
  ): Promise<Student> {
    const { student_id } = updateStudentProfileInput;
    const student = await this.studentsService.findOneById(student_id);

    if (!student) {
      throw new UnauthorizedException();
    }

    return await this.studentsService.removeProfilePhoto(student);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; student_id: number }): Promise<Student> {
    return this.studentsService.findOneById(reference.student_id);
  }
}
