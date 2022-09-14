/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { StudentRecordFileKind } from '../enums';

@Injectable()
export class StudentRecordService {
  constructor() {}

  async createStudentRecord(
    studentId: number,
    regionId: number,
    fileId: number,
    fileKind: StudentRecordFileKind,
  ): Promise<boolean> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
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
            (StudentId, RegionId, created_at, updated_at)
          VALUES
            (${studentId}, ${regionId}, NOW(), NOW());
        `);
        recordId = record.insertId;
      }

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

      queryRunner.release();
      return true;
    } catch {
      return false;
    }
  }
}
