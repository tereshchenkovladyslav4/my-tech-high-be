import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldsToSchoolYearsTable1673202951813 implements MigrationInterface {
  name = 'AddSomeFieldsToSchoolYearsTable1673202951813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`direct_orders_technology_instructions\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`direct_orders_supplement_instructions\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`direct_orders_custom_built_instructions\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements_technology_instructions\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements_supplement_instructions\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements_custom_built_instructions\` text NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements_third_party_instructions\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`reimbursements_required_software_instructions\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements_required_software_instructions\``,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements_third_party_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements_custom_built_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements_supplement_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`reimbursements_technology_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_orders_custom_built_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_orders_supplement_instructions\``);
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`direct_orders_technology_instructions\``);
  }
}
