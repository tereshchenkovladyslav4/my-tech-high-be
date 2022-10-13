import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveColumnFromEnrollmentQuestionTable1654536449208 implements MigrationInterface {
  name = 'RemoveColumnFromEnrollmentQuestionTable1654536449208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`removable\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` ADD \`removable\` tinyint NOT NULL DEFAULT 0`);
  }
}
