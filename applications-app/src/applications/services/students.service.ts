import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../models/student.entity';
import { CreateStudentInput } from '../dto/new-student.inputs';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
import { StudentStatusService } from './student-status.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { StudentAssessmentService } from './student-assessment.service';
import * as Moment from 'moment';
import { RESOURCE_ACTIVE_STATUSES } from '../constants';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private studentStatusService: StudentStatusService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private studentAssessmentService: StudentAssessmentService,
  ) {}

  async findOneById(student_id: number): Promise<Student> {
    return await this.studentsRepository.findOne({
      where: { student_id: student_id },
      relations: [
        'person',
        'parent',
        'applications',
        'parent.person',
        'grade_levels',
        'student_grade_level',
        'person.person_address',
        'person.person_address.address',
        'parent.person.person_address',
        'parent.person.person_address.address',
        'person.person_phone',
        'parent.person.person_phone',
      ],
    });
  }

  async delete(student_id): Promise<Student> {
    const student = await this.findOneById(student_id);
    await this.studentsRepository.delete(student_id);
    return student;
  }

  async findOneByParent(parent_id: number): Promise<Student[]> {
    return await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoin(StudentGradeLevel, 'grade_level', 'grade_level.student_id = student.student_id')
      .leftJoin(StudentStatus, 'status', 'status.student_id = student.student_id')
      // .innerJoin(PersonAddress, "personaddress", "personaddress.address_id = address.address_id")
      .where('student.parent_id = :parent_id', { parent_id: parent_id })
      .orderBy('status.status', 'ASC')
      .orderBy('person.first_name', 'ASC')
      .getMany();
    // return this.studentsRepository.find({ where: { parent_id: parent_id } });
  }

  async create(student: CreateStudentInput): Promise<Student> {
    return this.studentsRepository.save(student);
  }

  async update(updateStudentInput: UpdateStudentInput): Promise<boolean> {
    try {
      const {
        student_id,
        special_ed,
        grade_level,
        diploma_seeking,
        testing_preference,
        opt_out_form_signature_name,
        opt_out_form_signature_file_id,
      } = updateStudentInput;
      if (grade_level != null && grade_level != 'undefined') {
        const studentGradeLevels = await this.studentGradeLevelsService.forStudents(student_id);
        const current_grade_level = studentGradeLevels[0];
        current_grade_level.grade_level = grade_level;
        await this.studentGradeLevelsService.createOrUpdate(current_grade_level);
      }

      await this.studentsRepository.save({
        student_id,
        special_ed,
        diploma_seeking,
        testing_preference,
        opt_out_form_signature_name,
        opt_out_form_signature_file_id,
      });

      await this.studentStatusService.update(updateStudentInput);
      // testing_preference update
      await this.studentAssessmentService.updateTestAnswer(testing_preference);

      return true;
    } catch (error) {
      return false;
    }
  }

  async generateUsername(student_id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { student_id },
      relations: ['person', 'applications', 'applications.school_year', 'parent', 'parent.person'],
    });

    const username_first = student.person.first_name?.toLowerCase();
    const username_last = student.person.last_name?.toLowerCase();
    const year = Moment(
      student.applications?.[student.applications?.length - 1]?.school_year?.date_begin || new Date(),
    ).format('YYYY');

    const usernameBirthYear = Moment(student.person.date_of_birth || new Date()).format('YYYY');
    const username_email = student.person.email;
    const username_parent_email = student.parent.person.email;

    let usernameAccount = 0;
    while (true) {
      const usernameAccountSuffix = usernameAccount ? `${usernameAccount}` : '';
      const username_first_last = `${username_first}${username_last}${usernameAccountSuffix}`;
      const username_last_first = `${username_last}${username_first}${usernameAccountSuffix}`;
      const username_last_first_year = `${username_last}${username_first}${usernameAccountSuffix}${year}`;
      const username_last_firstinitial = `${username_last}${username_first?.[0]}${usernameAccountSuffix}`;
      const username_last_first_mth = `${username_last}${username_first}${usernameAccountSuffix}mth`;
      const username_last_first_birth = `${username_last}${username_first}${usernameAccountSuffix}${usernameBirthYear}`;
      const username_first_last_domain = `${username_first}${username_last}${usernameAccountSuffix}@mytechhigh.com`;
      const duplicateStudents = await this.studentsRepository.count({
        where: `(
          username_first_last = "${username_first_last}" OR 
          username_last_first = "${username_last_first}" OR 
          username_last_firstinitial = "${username_last_firstinitial}" 
          ) AND student_id <> ${student_id}`,
      });
      usernameAccount += 1;
      if (duplicateStudents) continue;

      return await this.studentsRepository.save({
        student_id,
        username_first,
        username_last,
        username_first_last: `${username_first_last}`,
        username_last_first: `${username_last_first}`,
        username_last_first_year: `${username_last_first_year}`,
        username_last_firstinitial: `${username_last_firstinitial}`,
        username_last_first_mth: `${username_last_first_mth}`,
        username_last_first_birth: `${username_last_first_birth}`,
        username_first_last_domain: `${username_first_last_domain}`,
        username_student_email: `${username_email}`,
        username_parent_email: `${username_parent_email}`,
      });

      break;
    }
  }

  async findStudentsForResource(schoolYearId: number, grades: string): Promise<Student[]> {
    const students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.status', 'StudentStatus')
      .leftJoinAndSelect('student.grade_levels', 'GradeLevels')
      .andWhere(`StudentStatus.school_year_id = ${schoolYearId}`)
      .andWhere(`GradeLevels.school_year_id = ${schoolYearId}`)
      .andWhere(`FIND_IN_SET(GradeLevels.grade_level,'${grades}') <> 0`)
      .andWhere(`StudentStatus.status IN ("${RESOURCE_ACTIVE_STATUSES.join('","')}")`)
      .getMany();
    return students;
  }
}
