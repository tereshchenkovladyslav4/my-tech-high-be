import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { SaveStudenGradeLeveltInput } from '../dto/save-student-grade-level.inputs';

@Injectable()
export class StudentGradeLevelsService {
  constructor(
    @InjectRepository(StudentGradeLevel)
    private readonly studentGradeLevelsRepository: Repository<StudentGradeLevel>,
  ) {}

  async createOrUpdate(gradeLevel: SaveStudenGradeLeveltInput): Promise<StudentGradeLevel> {
    return this.studentGradeLevelsRepository.save(gradeLevel);
  }

  forStudents(student_id: number): Promise<StudentGradeLevel[]> {
    return this.studentGradeLevelsRepository.find({ where: { student_id: student_id } });
  }

  async delete(student_id: number, school_year_id: number): Promise<string> {
    await this.studentGradeLevelsRepository.delete({ student_id, school_year_id });
    return 'deleted';
  }

  async update(student_id: number, school_year_id: number): Promise<string> {
    await this.studentGradeLevelsRepository.update(
      { student_id },
      {
        school_year_id,
      },
    );
    return 'updated';
  }
}
