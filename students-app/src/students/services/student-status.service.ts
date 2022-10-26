import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusEnum } from '../enums';

@Injectable()
export class StudentStatusService {
  constructor(
    @InjectRepository(StudentStatus)
    private readonly StudentStatusRepository: Repository<StudentStatus>,
  ) {}

  async findOneById(studend_id: number): Promise<StudentStatus> {
    return this.StudentStatusRepository.findOne(studend_id);
  }

  async findAllById(student_id: number): Promise<StudentStatus[]> {
    return this.StudentStatusRepository.find({
      where: { student_id: student_id },
    });
  }

  async findActive(student_id: number): Promise<StudentStatus[]> {
    return this.StudentStatusRepository.find({
      where: { student_id: student_id, status: In([StudentStatusEnum.PENDING, StudentStatusEnum.ACTIVE]) },
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
