import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentLearningLog } from '../models/student-learning-log.entity';

@Injectable()
export class StudentLearningLogService {
  constructor(
    @InjectRepository(StudentLearningLog)
    private readonly repository: Repository<StudentLearningLog>,
  ) {}

  async find(school_year_id: number, student_id: number): Promise<StudentLearningLog[]> {
    const result = await this.repository
      .createQueryBuilder('studentLearningLog')
      .where('studentLearningLog.SchoolYearId = :schoolYearId', { schoolYearId: school_year_id })
      .andWhere('studentLearningLog.StudentId = :studentId', { studentId: student_id })
      .getMany();

    return result;
  }

  async findAllByStudentId(student_id: number): Promise<StudentLearningLog[]> {
    return this.repository.find({ StudentId: student_id });
  }
}
