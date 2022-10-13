import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldsToSchoolYearTable1661997251318 implements MigrationInterface {
  name = 'AddSomeFieldsToSchoolYearTable1661997251318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`testing_preference_title\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`testing_preference_description\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`opt_out_form_title\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`opt_out_form_description\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`opt_out_form_description\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`opt_out_form_title\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`testing_preference_description\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`testing_preference_title\``);
  }
}
