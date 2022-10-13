import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyEnrollmentQuestionTable1654878360044 implements MigrationInterface {
  name = 'ModifyEnrollmentQuestionTable1654878360044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`additional\``);
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`additional2\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` ADD \`additional_question\` VARCHAR(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` ADD \`additional\` TEXT`);
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` ADD \`additional\` TEXT`);
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`additional_question\``);
  }
}
