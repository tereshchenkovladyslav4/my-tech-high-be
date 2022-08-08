import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceSettingsTable1659552776099
  implements MigrationInterface
{
  name = 'UpdateResourceSettingsTable1659552776099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` ADD \`allow_request\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` DROP COLUMN \`deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` DROP COLUMN \`allow_request\``,
    );
  }
}
