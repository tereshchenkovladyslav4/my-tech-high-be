import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRegionTable1660329439818 implements MigrationInterface {
  name = 'UpdateRegionTable1660329439818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`resource_confirm_details\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`resource_confirm_details\``);
  }
}
