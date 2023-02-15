import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeroomStudent } from '../models/homeroom-student.entity';

@Injectable()
export class StudentHomeroomService {
  constructor(
    @InjectRepository(HomeroomStudent)
    private studentHomeroomRepository: Repository<HomeroomStudent>,
  ) {}

  findOneById(student_id: number, school_year_id: number): Promise<HomeroomStudent> {
    return this.studentHomeroomRepository
      .createQueryBuilder('homeroomStudent')
      .leftJoinAndSelect('homeroomStudent.Class', 'Class')
      .leftJoinAndSelect('Class.PrimaryTeacher', 'PrimaryTeacher')
      .where('homeroomStudent.student_id = :studentId', { studentId: student_id })
      .andWhere('homeroomStudent.school_year_id = :schoolYearId', { schoolYearId: school_year_id })
      .getOne();
  }
}
