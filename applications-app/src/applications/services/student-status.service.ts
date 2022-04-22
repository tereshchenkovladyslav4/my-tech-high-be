import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
import { SchoolYearDataInput } from '../dto/school-year-data.Input'
import { SchoolYearData } from '../models/school-year-data.entity'
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

  async getAllCount(schoolYearDataInput: SchoolYearDataInput): Promise<SchoolYearData[]> {
    const total = await this.studentStatussRepository.count({ where: { school_year_id: schoolYearDataInput.school_year_id } });
    const pending = await this.studentStatussRepository.count({ where: { school_year_id: schoolYearDataInput.school_year_id, status: 0 } });
    const active = await this.studentStatussRepository.count({ where: { school_year_id: schoolYearDataInput.school_year_id, status: 1 } });
    const withdrawn = await this.studentStatussRepository.count({ where: { school_year_id: schoolYearDataInput.school_year_id, status: 2 } });
    const data = [{ 
      students: [{ status: 'pending', count: pending }, { status: 'Active', count: active }, { status: 'Total', count: total },{ status: 'Withdrawn', count: withdrawn },{ status: 'Graduated', count: 0 }], 
      parents: [{  status: 'pending', count: 37 }, { status: 'Active', count: 61 }, { status: 'Total', count: 106 },{ status: 'Withdrawn', count: 13 },{ status: 'Graduated', count: 11 }], 
      special_ed: [{ status: 'pending', count: 31 }, { status: 'Active', count: 38 }, { status: 'Total', count: 74 },{ status: 'Withdrawn', count: 7 },{ status: 'Graduated', count: 8 }] 
    }]
    return data
  }

}
