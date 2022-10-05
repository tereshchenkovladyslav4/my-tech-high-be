import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldToSchoolYearTable1664853767097 implements MigrationInterface {
  name = 'AddSomeFieldToSchoolYearTable1664853767097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`homeroom_resource_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`homeroom_resource_close\` date NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`homeroom_resource_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`homeroom_resource_open\``);
  }
}
