import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchoolYearTable1669673822651 implements MigrationInterface {
  name = 'UpdateSchoolYearTable1669673822651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimburse_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimburse_tech_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimburse_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_order_tech_enabled\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_order_tech_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimbursement_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimbursement_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`custom_built_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`custom_built_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`require_software_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`require_software_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`third_party_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`third_party_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_direct_order_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_direct_order_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_reimbursement_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_reimbursement_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_custom_built_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_custom_built_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_require_software_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_require_software_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_third_party_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`mid_third_party_close\` date NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_third_party_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_third_party_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_require_software_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_require_software_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_custom_built_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_custom_built_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_reimbursement_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_reimbursement_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_direct_order_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`mid_direct_order_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`third_party_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`third_party_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`require_software_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`require_software_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`custom_built_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`custom_built_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursement_close\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursement_open\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`direct_order_tech_open\` date NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`direct_order_tech_enabled\` tinyint NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimburse_close\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimburse_tech_open\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimburse_open\` date NULL`);
  }
}
