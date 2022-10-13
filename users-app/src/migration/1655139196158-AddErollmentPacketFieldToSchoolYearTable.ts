import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErollmentPacketFieldToSchoolYearTable1655139196158 implements MigrationInterface {
  name = 'AddErollmentPacketFieldToSchoolYearTable1655139196158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`enrollment_packet\` tinyint NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`enrollment_packet\``);
  }
}
