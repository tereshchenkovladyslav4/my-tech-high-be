/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { StudentRecordFileKind } from '../enums';

@Injectable()
export class StudentRecordService {
  constructor() {}

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
        SELECT * FROM infocenter.mth_student_record
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
}
