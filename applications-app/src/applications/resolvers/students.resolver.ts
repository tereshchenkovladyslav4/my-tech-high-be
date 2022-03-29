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
import { PersonsService } from '../services/persons.service';
import { ParentsService } from '../services/parents.service';
import { PacketsService } from '../services/packets.service';
import { ApplicationsService } from '../services/applications.service';
import { Packet } from '../models/packet.entity';
import { Application } from '../models/application.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateStudentInput } from '../dto/update-student.inputs';
@Resolver((of) => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private packetsService: PacketsService,
    private applicationsService: ApplicationsService,
  ) {}

  @ResolveField((of) => [Packet], { name: 'packets' })
  public async getPackets(@TypeParent() student: Student): Promise<Packet[]> {
    return this.packetsService.findByStudent(student.student_id);
  }

  @ResolveField((of) => [Application], { name: 'applications' })
  public async getApplications(
    @TypeParent() student: Student,
  ): Promise<Application[]> {
    return this.applicationsService.findByStudent(student.student_id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    student_id: number;
  }): Promise<Student> {
    return this.studentsService.findOneById(reference.student_id);
  }

  @Mutation((returns) => Boolean, { name: 'updateStudent' })
  @UseGuards(new AuthGuard())
  async updateStudent(
    @Args('updateStudentInput')
    updateStudentInput: UpdateStudentInput,
  ): Promise<boolean> {
    return this.studentsService.update(updateStudentInput);
  }
}
