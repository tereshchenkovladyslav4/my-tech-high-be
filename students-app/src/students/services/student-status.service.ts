import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { RESOURCE_ACTIVE_STATUSES } from '../constants';

@Injectable()
export class StudentStatusService {
  constructor(
    @InjectRepository(StudentStatus)
    private readonly StudentStatusRepository: Repository<StudentStatus>,
  ) {}

  async findOneById(student_id: number): Promise<StudentStatus> {
    return this.StudentStatusRepository.findOne(student_id);
  }

  async findAllById(student_id: number): Promise<StudentStatus[]> {
    return this.StudentStatusRepository.find({
      where: { student_id: student_id },
    });
  }

  async findResourceActive(student_id: number): Promise<StudentStatus[]> {
    return this.StudentStatusRepository.find({
      where: { student_id: student_id, status: In(RESOURCE_ACTIVE_STATUSES) },
    });
  }

  async updateOrCreate(studentStatus: StudentStatus): Promise<boolean> {
    const result = this.StudentStatusRepository.upsert(
      {
        student_id: studentStatus.student_id,
        status: studentStatus.status,
        school_year_id: studentStatus.school_year_id,
        date_updated: new Date(),
      },
      ['student_id', 'school_year_id'],
    ).catch(() => null);
    return !!result;
  }
}
