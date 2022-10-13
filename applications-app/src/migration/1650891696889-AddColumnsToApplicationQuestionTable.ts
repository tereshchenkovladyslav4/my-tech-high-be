import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToApplicationQuestionTable1650891696889 implements MigrationInterface {
  name = 'AddColumnsToApplicationQuestionTable1650891696889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` ADD \`student_question\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` ADD \`default_question\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` ADD \`validation\` integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` ADD \`slug\` varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` DROP COLUMN \`student_question\``);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` DROP COLUMN \`default_question\``);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` DROP COLUMN \`validation\``);
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` DROP COLUMN \`slug\``);
  }
}
