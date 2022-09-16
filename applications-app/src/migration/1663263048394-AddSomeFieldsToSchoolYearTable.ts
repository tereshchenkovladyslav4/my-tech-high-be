import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldsToSchoolYearTable1663263048394 implements MigrationInterface {
  name = 'AddSomeFieldsToSchoolYearTable1663263048394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`schedule\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`diploma_seeking\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`testing_preference\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`schedule_builder_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`schedule_builder_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`second_semester_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`second_semester_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`midyear_schedule_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`midyear_schedule_close\` date NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`midyear_schedule_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`midyear_schedule_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`second_semester_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`second_semester_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`schedule_builder_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`schedule_builder_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`testing_preference\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`diploma_seeking\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`schedule\``);
  }
}
