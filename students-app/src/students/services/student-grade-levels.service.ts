import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentGradeLevelsArgs } from '../dto/student-grade-level.args';

@Injectable()
export class StudentGradeLevelsService {
  constructor(
    @InjectRepository(StudentGradeLevel)
    private readonly studentGradeLevelsRepository: Repository<StudentGradeLevel>,
  ) {}

  findAll(studentGradeLevelsArgs: StudentGradeLevelsArgs): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsRepository.find(studentGradeLevelsArgs);
  }

  findForStudentBySchoolYear(studentId: number, schoolYearId: number): Promise<StudentGradeLevel> {
    return this.studentGradeLevelsRepository.findOne({
      student_id: studentId,
      school_year_id: schoolYearId,
    });
  }

  findByStudentID(student_id: number): Promise<StudentGradeLevel> {
    return this.studentGradeLevelsRepository.findOne({
      student_id: student_id,
    });
  }

  forStudents(student_id: number): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsRepository
      .createQueryBuilder('studentGradeLevel')
      .where('student_id = :student_id', { student_id: student_id })
      .addSelect('ABS(studentGradeLevel.grade_level + 0)', 'student_grade_level')
      .orderBy('student_grade_level', 'ASC')
      .getMany();
  }
}
