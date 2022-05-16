import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToEnrollmentQuestionsTable1651513539570
  implements MigrationInterface
{
  name = 'AddColumnsToEnrollmentQuestionsTable1651513539570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` ADD \`display_admin\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` ADD \`default_question\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` ADD \`validation\` integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` ADD \`slug\` varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`display_admin\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`default_question\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`validation\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` DROP COLUMN \`slug\``,
    );
  }
}
