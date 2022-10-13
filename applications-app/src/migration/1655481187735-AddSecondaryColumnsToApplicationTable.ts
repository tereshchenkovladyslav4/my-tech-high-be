import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecondaryColumnsToApplicationTable1655481187735 implements MigrationInterface {
  name = 'AddSecondaryColumnsToApplicationTable1655481187735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application\` ADD \`secondary_contact_first\` varchar(60) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_application\` ADD \`secondary_contact_last\` varchar(60) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application\` DROP COLUMN \`secondary_contact_first\``);
    await queryRunner.query(`ALTER TABLE \`mth_application\` DROP COLUMN \`secondary_contact_last\``);
  }
}
