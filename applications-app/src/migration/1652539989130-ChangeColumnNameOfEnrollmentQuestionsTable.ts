import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnNameOfEnrollmentQuestionsTable1652539989130 implements MigrationInterface {
  name = 'ChangeColumnNameOfEnrollmentQuestionsTable1652539989130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_questions\` CHANGE \`student_question\` \`display_admin\` TINYINT NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` CHANGE \`display_admin\` \`student_question\` TINYINT NOT NULL`,
    );
  }
}
