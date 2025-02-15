import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { StudentStatus } from '../models/student-status.entity';
import { UpdateStudentInput } from '../dto/update-student.inputs';
import { SchoolYearDataInput } from '../dto/school-year-data.Input';
import { SchoolYearData } from '../models/school-year-data.entity';
import { StudentStatusEnum } from '../enums';

@Injectable()
export class StudentStatusService {
  constructor(
    @InjectRepository(StudentStatus)
    private readonly studentStatussRepository: Repository<StudentStatus>,
  ) {}

  async update(updateStudentInput: UpdateStudentInput): Promise<boolean> {
    try {
      const { student_id, status, school_year_id } = updateStudentInput;
      if (student_id && school_year_id) {
        await this.studentStatussRepository.delete({ student_id: student_id });

        await this.studentStatussRepository.save({
          student_id,
          school_year_id,
          status,
          date_updated: new Date(),
        });

        if (status == 0 || status == 5 || status == 6) {
          const queryRunner = await getConnection().createQueryRunner();
          await queryRunner.query(
            `UPDATE 
            infocenter.mth_application 
          SET 
            status='${status == 0 || status == 6 ? 'Accepted' : 'Submitted'}', 
            ${status == 0 || status == 6 ? 'date_accepted = NOW()' : 'date_submitted = NOW()'}
          WHERE 
            student_id = ${student_id} AND
            school_year_id = ${school_year_id};`,
          );
          queryRunner.release();
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllCount(schoolYearDataInput: SchoolYearDataInput): Promise<SchoolYearData[]> {
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
    const students = [];
    const sped = [];
    const parents = [];
    const status = ['Pending', 'Active', 'Total', 'Withdrawn', 'Graduated'];

    const studentTotal = studentResult.reduce((accumulator, object) => {
      return accumulator + Number(object.count || 0);
    }, 0);
    // const spedTotal = studentResult.reduce((accumulator, object) => {
    //   return accumulator + Number(object.sped || 0);
    // }, 0);
    let spedTotal = 0;
    studentResult.forEach((element) => {
      if (Number(element.status) === StudentStatusEnum.PENDING) {
        students.push({ status: 'Pending', count: element.count });
        sped.push({ status: 'Pending', count: element.sped });
        spedTotal += Number(element.sped || 0);
      } else if (Number(element.status) === StudentStatusEnum.ACTIVE) {
        students.push({ status: 'Active', count: element.count });
        sped.push({ status: 'Active', count: element.sped });
        spedTotal += Number(element.sped || 0);
      } else if (Number(element.status) === StudentStatusEnum.WITHDRAWN) {
        students.push({ status: 'Withdrawn', count: element.count });
        sped.push({ status: 'Withdrawn', count: element.sped });
      } else if (Number(element.status) === StudentStatusEnum.GRADUATED) {
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
      if (Number(element.status) === StudentStatusEnum.PENDING) {
        parents.push({ status: 'Pending', count: element.count });
      } else if (Number(element.status) === StudentStatusEnum.ACTIVE) {
        parents.push({ status: 'Active', count: element.count });
      } else if (Number(element.status) === StudentStatusEnum.WITHDRAWN) {
        parents.push({ status: 'Withdrawn', count: element.count });
      } else if (Number(element.status) === StudentStatusEnum.GRADUATED) {
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
    students.sort((a, b) => status.indexOf(a.status) - status.indexOf(b.status));
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
