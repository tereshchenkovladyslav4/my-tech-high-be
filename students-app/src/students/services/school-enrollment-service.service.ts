import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { assignStudentToSOEInput } from '../dto/assign-student-soe.input';
import { SchoolEnrollment } from '../models/school-enrollment.entity';

@Injectable()
export class SchoolEnrollmentService {
  constructor(
    @InjectRepository(SchoolEnrollment)
    private readonly schoolEnrollmentRepository: Repository<SchoolEnrollment>,
  ) {}

  async assignStudentToSOE(assignStudentToSOEInput: assignStudentToSOEInput): Promise<boolean> {
    const { student_ids, school_year_id, school_partner_id } = assignStudentToSOEInput;
    for (let index = 0; index < student_ids.length; index++) {
      const studentId = student_ids[index];
      const existingPartner = await this.schoolEnrollmentRepository.findOne({
        student_id: studentId,
        school_year_id,
      });
      if (!existingPartner) {
        if (school_partner_id !== -1) {
          await this.schoolEnrollmentRepository.save({
            student_id: studentId,
            school_year_id,
            school_partner_id,
          });
        }
      } else {
        if (school_partner_id !== -1) {
          existingPartner.school_partner_id = school_partner_id;
          await existingPartner.save();
        } else {
          await existingPartner.remove();
        }
      }
    }
    return true;
  }
}
