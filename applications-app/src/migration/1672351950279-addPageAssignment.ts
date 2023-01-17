import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPageAssignment1672351950279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE mth_assignments ADD page_count int(11) NOT NULL DEFAULT 1;');
    await queryRunner.query('ALTER TABLE mth_learning_log_questions ADD page int(11) NOT NULL DEFAULT 1;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_assignments\` DROP COLUMN \`page_count\``);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`page\``);
  }
}
