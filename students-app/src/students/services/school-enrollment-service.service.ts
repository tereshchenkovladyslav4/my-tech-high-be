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
    console.log({ assignStudentToSOEInput });
    const { student_ids, school_year_id, school_partner_id } = assignStudentToSOEInput;
    for (let index = 0; index < student_ids.length; index++) {
      const studentId = student_ids[index];
      const existingPartner = await this.schoolEnrollmentRepository.findOne({
        student_id: studentId,
        school_year_id,
      });
      if (!existingPartner) {
        await this.schoolEnrollmentRepository.save({
          student_id: studentId,
          school_year_id,
          school_partner_id,
        });
      } else {
        existingPartner.school_partner_id = school_partner_id;
        await existingPartner.save();
      }
    }
    return true;
  }
}
