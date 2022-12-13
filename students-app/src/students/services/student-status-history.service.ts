import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentStatusHistory } from '../models/student-status-history.entity';

@Injectable()
export class StudentStatusHistoryService {
  constructor(
    @InjectRepository(StudentStatusHistory)
    private readonly StudentStatusHistoryRepository: Repository<StudentStatusHistory>,
  ) {}

  findOneById(studend_id: number): Promise<StudentStatusHistory> {
    return this.StudentStatusHistoryRepository.findOne(studend_id);
  }

  findAllById(student_id: number): Promise<StudentStatusHistory[]> {
    return this.StudentStatusHistoryRepository.find({
      where: { student_id: student_id },
    });
  }

  async updateOrCreate(studentStatusHistory: StudentStatusHistory): Promise<boolean> {
    const result = this.StudentStatusHistoryRepository.insert({
      student_id: studentStatusHistory.student_id,
      school_year_id: studentStatusHistory.school_year_id,
      status: studentStatusHistory.status,
      date_updated: new Date(),
    });

    return !!result;
  }
}
