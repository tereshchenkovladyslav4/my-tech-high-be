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
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private studentStatusService: StudentStatusService,
    private studentGradeLevelsService: StudentGradeLevelsService,
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

  findOneByPersonId(person_id: number): Promise<Student> {
    return this.studentsRepository.findOne({ person_id });
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
      if (grade_level != null) {
        const studentGradeLevels = await this.studentGradeLevelsService.forStudents(student_id);
        const current_grade_level = studentGradeLevels[0];
        current_grade_level.grade_level = grade_level;
        await this.studentGradeLevelsService.createOrUpdate(current_grade_level)
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
      return true;
    } catch (error) {
      return false;
    }
  }
}
