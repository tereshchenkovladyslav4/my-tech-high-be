import { MigrationInterface, QueryRunner } from 'typeorm';

export class createschoolyearEnrollmentTab1675434047209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE mth_enrollment_question_group DROP COLUMN school_year_id, DROP COLUMN mid_year`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_enrollment_question_tab\` ADD \`school_year_id\` int NULL AFTER \`id\`, ADD \`mid_year\` tinyint DEFAULT 0 AFTER \`school_year_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mth_enrollment_question_tab DROP COLUMN school_year_id, DROP COLUMN mid_year`);
  }
}
