import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getConnection, Repository } from 'typeorm';
import { StudentRecordSearchInput } from '../dto/student_record_search_input';
import { StudentRecord } from '../models/student-record.entity';
import { Pagination } from '../paginate';
@Injectable()
export class StudentRecordService {
  constructor(
    @InjectRepository(StudentRecord)
    private readonly repo: Repository<StudentRecord>,
  ) {}

  async find(
    param: StudentRecordSearchInput,
  ): Promise<Pagination<StudentRecord>> {
    const { pagination, filter, search_key } = param;
    const { skip, take } = pagination;
    const {
      region_id,
      grade_level_1,
      grade_level_2,
      program_year,
      status,
      school_of_enrollment,
      special_ed,
      enrollment_packet_document,
      other,
      date_range_start,
      date_range_end,
    } = filter;

    const qb = this.repo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.Student', 'Student')
      .leftJoinAndSelect('record.StudentRecordFiles', 'StudentRecordFiles')
      .leftJoinAndSelect('Student.person', 'person')
      .leftJoinAndSelect('Student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('StudentRecordFiles.File', 'File')
      .leftJoinAndSelect('Student.status', 'student_status')
      .where(`record.RegionId = ${region_id}`);

    let grades = [];
    if (grade_level_1) {
      const gradeLevels = JSON.parse(grade_level_1);
      gradeLevels.map((item) => {
        if (!grades.includes(item)) {
          grades.push(item);
        }
        if (item === 'Kindergarten') {
          if (!grades.includes('Kin')) grades.push('Kin');
          if (!grades.includes('K')) grades.push('K');
        }
      });
    }

    if (grade_level_2) {
      const gradeLevels = JSON.parse(grade_level_2);
      gradeLevels.map((item) => {
        if (item === 'Kindergarten') {
          if (!grades.includes('Kin')) grades.push('Kin');
          if (!grades.includes('K')) grades.push('K');
        }
        if (item === '1-8' || item === '9-12') {
          for (
            let i = Number(item.split('-')[0]);
            i <= Number(item.split('-')[1]);
            i++
          ) {
            if (!grades.includes(i.toString())) {
              grades.push(i.toString());
            }
          }
        }
      });
    }

    let studentIds = [];

    if (program_year) {
      const programYear = JSON.parse(program_year);
      let cond = '';
      if (
        !programYear.includes('midYear') &&
        programYear.includes('schoolYear')
      ) {
        cond = 'WHERE midyear_application <> 1';
      } else if (
        programYear.includes('midYear') &&
        !programYear.includes('schoolYear')
      ) {
        cond = 'WHERE midyear_application = 1';
      }
      const queryRunner = await getConnection().createQueryRunner();
      const result = await queryRunner.query(
        `SELECT
          application.student_id AS student_id 
        FROM (
          SELECT * FROM infocenter.mth_application ${cond}
        ) AS application
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE schoolYear.RegionId = ${region_id};`,
      );
      queryRunner.release();
      result.map((item) => {
        if (!studentIds.includes(Number(item.student_id))) {
          studentIds.push(Number(item.student_id));
        }
      });
    }

    if (status) {
      const statusList = JSON.parse(status);
      if (statusList.includes('Withdrawn')) {
        qb.andWhere('student_status.status = 2');
      } else {
        qb.andWhere('student_status.status <> 2');
      }
    }

    if (search_key) {
      qb.andWhere(
        new Brackets((sub) => {
          return sub
            .orWhere(
              `CONCAT(person.last_name, ' ', person.first_name) LIKE '%${search_key}%'`,
            )
            .orWhere(`File.name LIKE '%${search_key}%'`);
        }),
      );
    }

    if (date_range_end && date_range_start) {
      qb.andWhere(
        new Brackets((sub) => {
          return sub
            .orWhere(
              `record.created_at >= '${date_range_start}' AND record.created_at <= '${date_range_end}'`,
            )
            .orWhere(
              `record.updated_at >= '${date_range_start}' AND record.updated_at <= '${date_range_end}'`,
            );
        }),
      );
    }

    if (school_of_enrollment) {
      // TO DO
    }

    if (special_ed) {
      // TO DO
    }

    if (enrollment_packet_document) {
      // TO DO
    }

    let fileKinds = [];

    if (other) {
      const fileKindList = JSON.parse(other);
      fileKindList.map((item) => {
        if (!fileKinds.includes(item)) {
          fileKinds.push(item);
        }
      });
    }

    if (grades.length > 0) {
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: grades });
    }

    if (studentIds.length > 0) {
      qb.andWhere('record.StudentId IN (:studentIds)', {
        studentIds: studentIds,
      });
    }

    if (fileKinds.length > 0) {
      qb.andWhere('StudentRecordFiles.file_kind IN (:fileKinds)', {
        fileKinds: fileKinds,
      });
    }
    qb.addSelect(
      "CONCAT(person.last_name, ' ', person.first_name)",
      'student_name',
    );
    qb.orderBy('student_name', 'ASC');
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();
    return new Pagination<StudentRecord>({
      results: results,
      total: total,
    });
  }
}
