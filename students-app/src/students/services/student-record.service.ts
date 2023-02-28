import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getConnection, Repository } from 'typeorm';
import { StudentRecordSearchInput } from '../dto/student_record_search_input';
import { StudentRecordFileKind, StudentStatusEnum } from '../enums';
import { StudentRecord } from '../models/student-record.entity';
import { Pagination } from '../paginate';
@Injectable()
export class StudentRecordService {
  constructor(
    @InjectRepository(StudentRecord)
    private readonly repo: Repository<StudentRecord>,
  ) {}

  async find(param: StudentRecordSearchInput): Promise<Pagination<StudentRecord>> {
    const { pagination, filter, search_key } = param;
    const { skip, take } = pagination;
    const {
      school_year_id,
      grade_level_1,
      grade_level_2,
      program_year,
      program_year_status,
      enrollment_status,
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
      .leftJoinAndSelect('Student.status_history', 'status_history')
      .where(`record.SchoolYearId = ${school_year_id}`);

    const grades = [];
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
          if (!grades.includes('Kindergarten')) grades.push('Kindergarten');
          if (!grades.includes('Kin')) grades.push('Kin');
          if (!grades.includes('K')) grades.push('K');
        } else if (item === '1-8' || item === '9-12') {
          for (let i = Number(item.split('-')[0]); i <= Number(item.split('-')[1]); i++) {
            if (!grades.includes(i.toString())) {
              grades.push(i.toString());
            }
          }
        }
      });
    }

    const studentIds = [];

    if (program_year) {
      const programYear = JSON.parse(program_year);
      let cond = '';
      if (!programYear.includes('midYear') && programYear.includes('schoolYear')) {
        cond = 'WHERE midyear_application = 0 OR midyear_application IS NULL';
      } else if (programYear.includes('midYear') && !programYear.includes('schoolYear')) {
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
        WHERE schoolYear.school_year_id = ${school_year_id};`,
      );
      queryRunner.release();
      result.map((item) => {
        if (!studentIds.includes(Number(item.student_id))) {
          studentIds.push(Number(item.student_id));
        }
      });
    }

    if (enrollment_status) {
      const enrollmentStatusList = JSON.parse(enrollment_status);
      qb.andWhere(
        new Brackets((sub) => {
          if (enrollmentStatusList?.includes('Withdrawn')) {
            sub.orWhere(`student_status.status = ${StudentStatusEnum.WITHDRAWN}`);
          } else {
            if (enrollmentStatusList?.includes('Pending'))
              sub.orWhere(`student_status.status = ${StudentStatusEnum.PENDING}`);
            if (enrollmentStatusList?.includes('Active'))
              sub.orWhere(`student_status.status = ${StudentStatusEnum.ACTIVE}`);
          }
          return sub;
        }),
      );
    } else {
      qb.andWhere(
        `(student_status.status = ${StudentStatusEnum.PENDING} OR student_status.status = ${StudentStatusEnum.ACTIVE})`,
      );
    }

    if (program_year_status) {
      const statusList = JSON.parse(program_year_status);
      qb.andWhere(
        new Brackets((sub) => {
          if (statusList?.includes('Returning'))
            sub.orWhere(
              `status_history.student_id IS NOT NULL AND (status_history.status = ${StudentStatusEnum.PENDING} OR status_history.status = ${StudentStatusEnum.ACTIVE})`,
            );
          if (statusList?.includes('New')) sub.orWhere(`status_history.student_id IS NULL`);
          //if (statusList?.includes('Transferred')) sub.orWhere('');
          return sub;
        }),
      );
    }

    if (search_key) {
      qb.andWhere(
        new Brackets((sub) => {
          return sub
            .orWhere(`CONCAT(person.last_name, ' ', person.first_name) LIKE '%${search_key}%'`)
            .orWhere(`File.name LIKE '%${search_key}%'`);
        }),
      );
    }

    if (date_range_end && date_range_start) {
      qb.andWhere(
        new Brackets((sub) => {
          return sub
            .orWhere(`record.created_at >= '${date_range_start}' AND record.created_at <= '${date_range_end}'`)
            .orWhere(`record.updated_at >= '${date_range_start}' AND record.updated_at <= '${date_range_end}'`);
        }),
      );
    }

    if (school_of_enrollment) {
      // TO DO
    }

    const specialEdList = [];
    if (special_ed) {
      const temp = JSON.parse(special_ed);
      if (temp?.length > 0) {
        temp.forEach((item) => {
          specialEdList.push(Number(item));
        });
      }
    }

    let fileKinds = [];

    if (other) {
      fileKinds = JSON.parse(other);
    }

    if (enrollment_packet_document) {
      if (fileKinds.length) fileKinds = fileKinds.concat(JSON.parse(enrollment_packet_document));
      else fileKinds = JSON.parse(enrollment_packet_document);
    }

    if (grades.length) {
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: grades });
    }

    if (studentIds.length) {
      qb.andWhere('record.StudentId IN (:studentIds)', {
        studentIds: studentIds,
      });
    }

    if (specialEdList.length) {
      qb.andWhere('Student.special_ed IN (:specialEds)', { specialEds: specialEdList });
    }

    if (fileKinds.length) {
      qb.andWhere('StudentRecordFiles.file_kind IN (:fileKinds)', {
        fileKinds: fileKinds,
      });
    }

    qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
    qb.orderBy('student_name', 'ASC');
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();
    return new Pagination<StudentRecord>({
      results: results,
      total: total,
    });
  }

  async createStudentRecord(
    studentId: number,
    schoolYearId: number,
    fileId: number,
    fileKind: StudentRecordFileKind,
  ): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    try {
      let recordId;
      const records = await queryRunner.query(`
        SElECT * FROM infocenter.mth_student_record
        WHERE StudentId = ${studentId};
      `);
      if (records.length) {
        recordId = records[0].record_id;
      } else {
        const record = await queryRunner.query(`
          INSERT INTO infocenter.mth_student_record
            (StudentId, SchoolYearId, created_at, updated_at)
          VALUES
            (${studentId}, ${schoolYearId}, NOW(), NOW());
        `);
        recordId = record.insertId;
      }

      await queryRunner.query(`
        DELETE FROM infocenter.mth_student_record_file WHERE RecordId = ${recordId} AND file_kind NOT IN ('${StudentRecordFileKind.STUDENT_PACKET}', '${StudentRecordFileKind.OPT_OUT_FORM}', '${StudentRecordFileKind.USIRS}', '${StudentRecordFileKind.WITHDRAWAL_FORM}')
      `);

      await queryRunner.query(`
        INSERT INTO infocenter.mth_student_record_file (RecordId, FileId, file_kind)
        SELECT ${recordId}, mth_file_id, kind
        FROM (
          SELECT packet_id FROM infocenter.mth_packet WHERE student_id = ${studentId}
        ) AS packet
        LEFT JOIN infocenter.mth_packet_file packetFile ON (packetFile.packet_id = packet.packet_id)
      `);

      if (fileId && fileKind) {
        const recordFiles = await queryRunner.query(`
          SELECT * FROM infocenter.mth_student_record_file
          WHERE RecordId = ${recordId} AND file_kind = "${fileKind}";
        `);

        if (!recordFiles.length) {
          await queryRunner.query(`
            INSERT INTO infocenter.mth_student_record_file
              (RecordId, FileId, file_kind, created_at, updated_at)
            VALUES
              (${recordId}, ${fileId}, "${fileKind}", NOW(), NOW());
          `);
        } else {
          const recordFileId = recordFiles[0].record_file_id;
          await queryRunner.query(`
            UPDATE infocenter.mth_student_record_file
            SET FileId = ${fileId}, updated_at = NOW()
            WHERE record_file_id = ${recordFileId};
          `);
        }
      }

      return true;
    } catch {
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async save(school_year_id: number, student_id: number): Promise<boolean> {
    try {
      const record = await this.repo.find({
        where: {
          SchoolYearId: school_year_id,
          StudentId: student_id,
        },
      });
      if (!record || record.length == 0) {
        await this.repo.save({
          SchoolYearId: school_year_id,
          StudentId: student_id,
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
