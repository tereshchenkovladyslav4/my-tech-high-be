import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  Int,
  ResolveField,
  Parent as TypeParent,
  Mutation,
} from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { Person } from '../models/person.entity';
import { Parent } from '../models/parent.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentGradeLevelsService } from '../services/student-grade-levels.service';
import { StudentsService } from '../services/students.service';
import { StudentsArgs } from '../dto/student.args';
import { PersonsService } from '../services/persons.service';
import { ParentsService } from '../services/parents.service';
import { StudentCurrentStatus } from '../models/student-current-status.entity';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusHistory } from '../models/student-status-history.entity';
import { ChangeStatusInput } from '../dto/change-status.input';
import { UpdateStudentProfileInput } from '../dto/update-profile.inputs';
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Resolver((of) => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
  ) {}

  @Query((returns) => Student, { name: 'student' })
  async getStudent(
    @Args({ name: 'student_id', type: () => ID }) student_id: number,
  ): Promise<Student> {
    return this.studentsService.findOneById(student_id);
  }

  @Query((returns) => [Student], { name: 'students' })
  async getStudents(@Args() studentsArgs: StudentsArgs): Promise<Student[]> {
    return this.studentsService.findAll(studentsArgs);
  }

  @ResolveField((of) => Person, { name: 'person' })
  public async getPerson(
    @TypeParent() student: Student,
  ): Promise<Person | any> {
    return (await this.personsService.findOneById(student.person_id)) || {};
  }

  @ResolveField((of) => Parent, { name: 'parent' })
  public async getParent(@TypeParent() student: Student): Promise<Parent> {
    return this.parentsService.findOneById(student.parent_id);
  }

  @ResolveField((of) => [StudentGradeLevel], { name: 'grade_levels' })
  public async getStudentGradeLevels(
    @TypeParent() student: Student,
  ): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsService.forStudents(student.student_id);
  }

  @ResolveField((of) => StudentCurrentStatus, {
    name: 'current_school_year_status',
  })
  public async getStudentCurrentStatus(
    @TypeParent() student: Student,
  ): Promise<StudentCurrentStatus> {
    return this.studentsService.getCurrentStatus(student.student_id);
  }

  @ResolveField((of) => [StudentStatus], { name: 'status', nullable: true })
  public async getStudentStatus(
    @TypeParent() student: Student,
  ): Promise<StudentStatus[]> {
    return this.studentsService.getStatus(student.student_id);
  }

  @ResolveField((of) => [StudentStatusHistory], {
    name: 'status_history',
    nullable: true,
  })
  public async getStudentStatusHistory(
    @TypeParent() student: Student,
  ): Promise<StudentStatusHistory[]> {
    return this.studentsService.getStatusHistory(student.student_id);
  }

  @Mutation((returns) => Boolean)
  async changeStatus(
    @Args('changeStatusInput') changeStatusInput: ChangeStatusInput,
  ) {
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

    return await this.studentsService.updateProfile(
      student,
      updateStudentProfileInput,
    );
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
  resolveReference(reference: {
    __typename: string;
    student_id: number;
  }): Promise<Student> {
    return this.studentsService.findOneById(reference.student_id);
  }
}
