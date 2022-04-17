import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getConnection } from 'typeorm';
import { Student } from '../models/student.entity';
import { StudentsArgs } from '../dto/student.args';
import { StudentCurrentStatus } from '../models/student-current-status.entity';
import { SchoolYearsService } from './schoolyears.service';
import { Application } from '../models/application.entity';
import { Packet } from '../models/packet.entity';
import { Person } from '../models/person.entity';
import { User } from '../models/user.entity';
import { Parent } from '../models/parent.entity';
import { StudentStatusService } from './student-status.service';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusHistoryService } from './student-status-history.service';
import { StudentStatusHistory } from '../models/student-status-history.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { UpdateStudentProfileInput } from '../dto/update-profile.inputs';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private schoolYearsService: SchoolYearsService,
    private studentStatusService: StudentStatusService,
    private studentStatusHistoryService: StudentStatusHistoryService,
  ) {}

  findAll(studentsArgs: StudentsArgs): Promise<Student[]> {
    return this.studentsRepository.find(studentsArgs);
  }

  findOneById(student_id: number): Promise<Student> {
    return this.studentsRepository.findOne(student_id);
  }

  findOneByPersonId(person_id: number): Promise<Student> {
    return this.studentsRepository.findOne(person_id);
  }

  async forUsers(user_id: number): Promise<Student[]> {
    const parent = await createQueryBuilder(Parent)
      .innerJoin(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoin(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getOne();
    if (parent !== undefined) {
      return this.studentsRepository.find({
        where: { parent_id: parent.parent_id },
      });
    } else {
      return [];
    }
  }

  async getCurrentStatus(student_id: number): Promise<StudentCurrentStatus> {
    const schoolYear = await this.schoolYearsService.getCurrent();

    const student = await createQueryBuilder(Student)
      .leftJoinAndSelect(
        Application,
        'application',
        'application.student_id = `Student`.student_id',
      )
      .leftJoinAndSelect(
        Packet,
        'packet',
        'packet.student_id = `Student`.student_id',
      )
      .leftJoinAndSelect(
        StudentGradeLevel,
        'gradelevel',
        'gradelevel.student_id = `Student`.student_id AND gradelevel.school_year_id = application.school_year_id',
      )
      .andWhere('application.school_year_id = :schoolYear', {
        schoolYear: schoolYear.school_year_id,
      })
      .andWhere('`Student`.student_id = :studentId', { studentId: student_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getRawOne();

    return {
      student_id: (student && student.Student_student_id) || student_id,
      school_year_id: schoolYear.school_year_id || null,
      grade_level: (student && student.gradelevel_grade_level) || null,
      application_id: (student && student.application_application_id) || null,
      application_status: (student && student.application_status) || null,
      application_school_year_id:
        (student && student.application_school_year_id) || null,
      packet_id: (student && student.packet_packet_id) || null,
      packet_status: (student && student.packet_status) || null,
    };
  }

  async getStatus(student_id: number): Promise<StudentStatus[]> {
    return this.studentStatusService.findAllById(student_id);
  }

  async getStatusHistory(student_id: number): Promise<StudentStatusHistory[]> {
    return this.studentStatusHistoryService.findAllById(student_id);
  }

  async updateStatus(studentStatus: StudentStatus): Promise<Boolean> {
    return this.studentStatusService.updateOrCreate(studentStatus);
  }

  async updateStatusHistory(
    studentStatusHistory: StudentStatusHistory,
  ): Promise<boolean> {
    return this.studentStatusHistoryService.updateOrCreate(
      studentStatusHistory,
    );
  }

  async updateProfile(
    student: Student,
    updateProfileInput: UpdateStudentProfileInput,
  ): Promise<Student> {
    const person = await createQueryBuilder(Person)
      .where('`Person`.person_id = :personId', { personId: student.person_id })
      .printSql()
      .getOne();

    const { preferred_first_name, preferred_last_name, email, photo } =
      updateProfileInput;
    // Update Person Data
    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set({
        preferred_first_name,
        preferred_last_name,
        email,
        photo: photo || null,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    return student;
  }

  async removeProfilePhoto(student: Student): Promise<Student> {
    const person = await createQueryBuilder(Person)
      .where('`Person`.person_id = :personId', { personId: student.person_id })
      .printSql()
      .getOne();

    // Update Person Data
    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set({
        photo: null,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    return student;
  }
}
