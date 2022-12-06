import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftwareReimbursementFieldToResourceSettingsTable1670336862410 implements MigrationInterface {
  name = 'AddSoftwareReimbursementFieldToResourceSettingsTable1670336862410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` ADD \`software_reimbursement\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_settings\` DROP COLUMN \`software_reimbursement\``);
  }
}
