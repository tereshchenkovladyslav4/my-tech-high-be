import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnabled1645394663055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` ADD \`is_enabled\` tinyint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` DROP COLUMN \`is_enabled\``,
    );
  }
}
