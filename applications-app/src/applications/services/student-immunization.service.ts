import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentImmunization } from '../models/student-immunization.entity';

@Injectable()
export class StudentImmunizationService {
  constructor(
    @InjectRepository(StudentImmunization)
    private StudentImmunizationRepository: Repository<StudentImmunization>,
  ) {}

  async createUpdate(data: StudentImmunization[]): Promise<boolean> {
    let result = true;
    data.forEach((item) => {
      this.StudentImmunizationRepository.upsert(
        {
          student_id: item.student_id,
          immunization_id: item.immunization_id,
          value: item.value,
          date_updated: new Date(),
          updated_by: item.student_id,
        },
        ['student_id', 'immunization_id'],
      ).catch(() => (result = false));
    });
    return result;
  }

  async findOne(studentId: number, immunizationId: number): Promise<StudentImmunization> {
    return this.StudentImmunizationRepository.findOne({
      where: { student_id: studentId, immunization_id: immunizationId },
    });
  }
  async findAll(studentId: number): Promise<StudentImmunization[]> {
    return this.StudentImmunizationRepository.find({
      where: { student_id: studentId },
    });
  }
}
