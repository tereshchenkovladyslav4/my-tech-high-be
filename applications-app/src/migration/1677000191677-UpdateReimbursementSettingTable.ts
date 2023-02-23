import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReimbursementSettingTable1677000191677 implements MigrationInterface {
  name = 'UpdateReimbursementSettingTable1677000191677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_reimbursement_setting\` ADD \`notification_grades\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_reimbursement_setting\` DROP COLUMN \`notification_grades\``);
  }
}
