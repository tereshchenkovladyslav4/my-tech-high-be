import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../models/student.entity';
import { Person } from '../models/person.entity';
import { CreateStudentInput } from '../dto/new-student.inputs';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
import { StudentStatusService } from './student-status.service';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private studentStatusService: StudentStatusService,
  ) {}

  async findOneById(student_id: number): Promise<Student> {
    return this.studentsRepository.findOne({
      where: { student_id: student_id },
      relations: ['person', 'parent', 'parent.person'],
    });
  }

  async delete(student_id): Promise<Student> {
    const student = await this.findOneById(student_id)
    await this.studentsRepository.delete(student_id)
    return student
  }

  async findOneByParent(parent_id: number): Promise<Student[]> {
    return await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoin(
        StudentGradeLevel,
        'grade_level',
        'grade_level.student_id = student.student_id',
      )
      .leftJoin(
        StudentStatus,
        'status',
        'status.student_id = student.student_id',
      )
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
        diploma_seeking,
        status,
        school_year_id,
        testing_preference,
      } = updateStudentInput;
      await this.studentsRepository.save({
        student_id,
        special_ed,
        diploma_seeking,
        testing_preference,
      });
      await this.studentStatusService.update(updateStudentInput);
      return true;
    } catch (error) {
      return false;
    }
  }
}
