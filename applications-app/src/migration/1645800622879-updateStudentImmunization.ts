import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateStudentImmunization1645800622879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` DROP COLUMN \`date_administered\``);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` DROP COLUMN \`exempt\``);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` DROP COLUMN \`nonapplicable\``);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` DROP COLUMN \`immune\``);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` ADD \`value\` varchar(20) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` ADD \`date_administered\` datetime`);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` ADD \`exempt\` tinyint`);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` ADD \`nonapplicable\` tinyint`);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` ADD \`immune\` tinyint`);
    await queryRunner.query(`ALTER TABLE \`mth_student_immunizations\` DROP COLUMN \`value\``);
  }
}
