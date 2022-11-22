import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchoolYearTable1669072483929 implements MigrationInterface {
  name = 'UpdateSchoolYearTable1669072483929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE \`mth_title\` SET \`reduce_funds\` = 'NONE' WHERE \`reduce_funds\` = 'none'`);
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`reduce_funds\` = 'TECHNOLOGY' WHERE \`reduce_funds\` = 'technology_allowance'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`reduce_funds\` = 'SUPPLEMENTAL' WHERE \`reduce_funds\` = 'supplemental_learning_funds'`,
    );

    await queryRunner.query(`UPDATE \`mth_provider\` SET \`reduce_funds\` = 'NONE' WHERE \`reduce_funds\` = 'none'`);
    await queryRunner.query(
      `UPDATE \`mth_provider\` SET \`reduce_funds\` = 'TECHNOLOGY' WHERE \`reduce_funds\` = 'technology_allowance'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_provider\` SET \`reduce_funds\` = 'SUPPLEMENTAL' WHERE \`reduce_funds\` = 'supplemental_learning_funds'`,
    );

    await queryRunner.query(`UPDATE \`mth_course\` SET \`reduce_funds\` = 'NONE' WHERE \`reduce_funds\` = 'none'`);
    await queryRunner.query(
      `UPDATE \`mth_course\` SET \`reduce_funds\` = 'TECHNOLOGY' WHERE \`reduce_funds\` = 'technology_allowance'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_course\` SET \`reduce_funds\` = 'SUPPLEMENTAL' WHERE \`reduce_funds\` = 'supplemental_learning_funds'`,
    );

    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`learning_logs\` tinyint NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`learning_logs_first_second_semesters\` tinyint NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements\` enum ('NONE', 'TECHNOLOGY', 'SUPPLEMENTAL') NULL COMMENT 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`require_software\` tinyint NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`direct_orders\` enum ('NONE', 'TECHNOLOGY', 'SUPPLEMENTAL') NULL COMMENT 'NONE: NONE(Disabled), TECHNOLOGY: Technology Allowance, SUPPLEMENTAL: Supplemental Learning Funds'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_orders\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`require_software\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`learning_logs_first_second_semesters\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`learning_logs\``);

    await queryRunner.query(`UPDATE \`mth_title\` SET \`reduce_funds\` = 'none' WHERE \`reduce_funds\` = 'NONE'`);
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`reduce_funds\` = 'technology_allowance' WHERE \`reduce_funds\` = 'TECHNOLOGY'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`reduce_funds\` = 'supplemental_learning_funds' WHERE \`reduce_funds\` = 'SUPPLEMENTAL'`,
    );

    await queryRunner.query(`UPDATE \`mth_provider\` SET \`reduce_funds\` = 'none' WHERE \`reduce_funds\` = 'NONE'`);
    await queryRunner.query(
      `UPDATE \`mth_provider\` SET \`reduce_funds\` = 'technology_allowance' WHERE \`reduce_funds\` = 'TECHNOLOGY'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_provider\` SET \`reduce_funds\` = 'supplemental_learning_funds' WHERE \`reduce_funds\` = 'SUPPLEMENTAL'`,
    );

    await queryRunner.query(`UPDATE \`mth_course\` SET \`reduce_funds\` = 'none' WHERE \`reduce_funds\` = 'NONE'`);
    await queryRunner.query(
      `UPDATE \`mth_course\` SET \`reduce_funds\` = 'technology_allowance' WHERE \`reduce_funds\` = 'TECHNOLOGY'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_course\` SET \`reduce_funds\` = 'supplemental_learning_funds' WHERE \`reduce_funds\` = 'SUPPLEMENTAL'`,
    );
  }
}
