import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentRecordTable1660087136983 implements MigrationInterface {
  name = 'CreateStudentRecordTable1660087136983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_student_record\` (\`record_id\` int NOT NULL AUTO_INCREMENT, \`StudentId\` int NULL, \`RegionId\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`record_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record\` ADD CONSTRAINT \`FK_b36e0527efbc9e40f8292dcbbbb\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_record\` ADD CONSTRAINT \`FK_745a17d6f9e175380aaf7b70f59\` FOREIGN KEY (\`RegionId\`) REFERENCES \`region\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student_record\` DROP FOREIGN KEY \`FK_745a17d6f9e175380aaf7b70f59\``);
    await queryRunner.query(`ALTER TABLE \`mth_student_record\` DROP FOREIGN KEY \`FK_b36e0527efbc9e40f8292dcbbbb\``);
    await queryRunner.query(`DROP TABLE \`mth_student_record\``);
  }
}
