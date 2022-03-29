import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
@Injectable()
export class StudentStatusService {
  constructor(
    @InjectRepository(StudentStatus)
    private readonly studentStatussRepository: Repository<StudentStatus>,
  ) {}

  async update(updateStudentInput: UpdateStudentInput): Promise<boolean> {
    try {
      const { student_id, status, school_year_id } = updateStudentInput;
      await this.studentStatussRepository.save({
        student_id,
        school_year_id,
        status,
        date_updated: new Date(),
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
