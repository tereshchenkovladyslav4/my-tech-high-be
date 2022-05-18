import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
import { SchoolYearDataInput } from '../dto/school-year-data.Input';
import { SchoolYearData } from '../models/school-year-data.entity';
import { WithdrawalService } from './withdrawal.service';
import { UpdateWithdrawalInput } from '../dto/update-withdrawal.inputs';

@Injectable()
export class StudentStatusService {
  constructor(
    @InjectRepository(StudentStatus)
    private readonly studentStatussRepository: Repository<StudentStatus>,
    private withdrawalService: WithdrawalService,
  ) {}

  async update(updateStudentInput: UpdateStudentInput): Promise<boolean> {
    try {
      const {
        student_id,
        status,
        school_year_id,
        withdrawOption,
        activeOption,
      } = updateStudentInput;
      await this.studentStatussRepository.save({
        student_id,
        school_year_id,
        status,
        date_updated: new Date(),
      });

      if (status == 2 && withdrawOption > 0) {
        const updateWithdrawalInput: UpdateWithdrawalInput = {
          StudentId: student_id,
          status:
            withdrawOption == 1
              ? 'Notified'
              : withdrawOption < 5
              ? 'Withdrawn'
              : '',
        };
        await this.withdrawalService.update(updateWithdrawalInput);
      }

      if (status == 1 && activeOption == 1) {
        await this.withdrawalService.delete(student_id);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllCount(
    schoolYearDataInput: SchoolYearDataInput,
  ): Promise<SchoolYearData[]> {
    const queryRunner = await getConnection().createQueryRunner();
    const ParentResult = await queryRunner.query(
      `SELECT 
      COUNT(DISTINCT p.parent_id) as count, ss.status 
      FROM mth_student_status AS ss 
      LEFT JOIN mth_student AS s ON s.student_id=ss.student_id
      LEFT JOIN mth_parent AS p ON p.parent_id=s.parent_id
      LEFT JOIN mth_schoolyear AS sy ON sy.school_year_id = ss.school_year_id
      WHERE ss.school_year_id='${schoolYearDataInput.school_year_id}' AND
      sy.RegionId = '${schoolYearDataInput.region_id}'
      GROUP BY ss.status ORDER BY ss.status`,
    );

    const studentResult = await queryRunner.query(`SELECT 
    COUNT(s.student_id) as count, ss.status, SUM(IF(s.special_ed>0,1,0)) as sped
    FROM mth_student_status AS ss 
    LEFT JOIN mth_student AS s ON s.student_id=ss.student_id
    LEFT JOIN mth_schoolyear AS sy ON sy.school_year_id = ss.school_year_id
    WHERE ss.school_year_id='${schoolYearDataInput.school_year_id}' AND
    sy.RegionId = '${schoolYearDataInput.region_id}'
    GROUP BY ss.status ORDER BY ss.status`);

    queryRunner.release();
    let students = [];
    let sped = [];
    let parents = [];
    const status = ['Pending', 'Active', 'Total', 'Withdrawn', 'Graduated'];

    const studentTotal = studentResult.reduce((accumulator, object) => {
      return accumulator + Number(object.count || 0);
    }, 0);
    const spedTotal = studentResult.reduce((accumulator, object) => {
      return accumulator + Number(object.sped || 0);
    }, 0);
    studentResult.forEach((element) => {
      if (Number(element.status) === 0) {
        students.push({ status: 'Pending', count: element.count });
        sped.push({ status: 'Pending', count: element.sped });
      } else if (Number(element.status) === 1) {
        students.push({ status: 'Active', count: element.count });
        sped.push({ status: 'Active', count: element.sped });
      } else if (Number(element.status) === 2) {
        students.push({ status: 'Withdrawn', count: element.count });
        sped.push({ status: 'Withdrawn', count: element.sped });
      } else if (Number(element.status) === 3) {
        students.push({ status: 'Graduated', count: element.count });
        sped.push({ status: 'Graduated', count: element.sped });
      }
    });
    students.push({ status: 'Total', count: studentTotal });
    studentResult;
    sped.push({ status: 'Total', count: spedTotal });

    const parentTotal = ParentResult.reduce((accumulator, object) => {
      return accumulator + Number(object.count || 0);
    }, 0);
    ParentResult.forEach((element) => {
      if (Number(element.status) === 0) {
        parents.push({ status: 'Pending', count: element.count });
      } else if (Number(element.status) === 1) {
        parents.push({ status: 'Active', count: element.count });
      } else if (Number(element.status) === 2) {
        parents.push({ status: 'Withdrawn', count: element.count });
      } else if (Number(element.status) === 3) {
        parents.push({ status: 'Graduated', count: element.count });
      }
    });
    parents.push({ status: 'Total', count: parentTotal });
    status.forEach((status) => {
      const found = students.some((el) => el.status === status);
      if (!found) students.push({ status: status, count: 0 });
    });
    status.forEach((status) => {
      const found = parents.some((el) => el.status === status);
      if (!found) parents.push({ status: status, count: 0 });
    });
    status.forEach((status) => {
      const found = sped.some((el) => el.status === status);
      if (!found) sped.push({ status: status, count: 0 });
    });
    students.sort(
      (a, b) => status.indexOf(a.status) - status.indexOf(b.status),
    );
    parents.sort((a, b) => status.indexOf(a.status) - status.indexOf(b.status));
    sped.sort((a, b) => status.indexOf(a.status) - status.indexOf(b.status));
    const data = [
      {
        students: students,
        parents: parents,
        special_ed: sped,
      },
    ];
    return data;
  }
}
