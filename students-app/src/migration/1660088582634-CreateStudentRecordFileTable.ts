import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentRecordFileTable1660088582634 implements MigrationInterface {
  name = 'CreateStudentRecordFileTable1660088582634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_student_record_file\` (\`record_file_id\` int NOT NULL AUTO_INCREMENT, \`RecordId\` int NULL, \`FileId\` int NULL, \`file_kind\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`record_file_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_file\` CHANGE \`file_id\` \`file_id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record_file\` ADD CONSTRAINT \`FK_e1ddbb0eca1c03a4d0c95a1d0f3\` FOREIGN KEY (\`RecordId\`) REFERENCES \`mth_student_record\`(\`record_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record_file\` ADD CONSTRAINT \`FK_390330881f9cca25d3d59c9d23f\` FOREIGN KEY (\`FileId\`) REFERENCES \`mth_file\`(\`file_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record_file\` DROP FOREIGN KEY \`FK_390330881f9cca25d3d59c9d23f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record_file\` DROP FOREIGN KEY \`FK_e1ddbb0eca1c03a4d0c95a1d0f3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_file\` CHANGE \`file_id\` \`file_id\` int UNSIGNED NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`DROP TABLE \`mth_student_record_file\``);
  }
}
