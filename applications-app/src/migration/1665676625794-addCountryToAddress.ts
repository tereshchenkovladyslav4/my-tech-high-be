import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCountryToAddress1665676625794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` ADD \`country_id\` VARCHAR(100)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` DROP COLUMN \`country_id\``);
  }
}
