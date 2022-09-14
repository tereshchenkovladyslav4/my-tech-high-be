import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceCartTable1662584477019 implements MigrationInterface {
  name = 'UpdateResourceCartTable1662584477019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\` ADD \`waitlist_confirmed\` tinyint NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\` DROP COLUMN \`waitlist_confirmed\``);
  }
}
