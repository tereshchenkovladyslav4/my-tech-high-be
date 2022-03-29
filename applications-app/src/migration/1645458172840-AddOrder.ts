import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrder1645458172840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` ADD \`order\` integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` DROP COLUMN \`order\``,
    );
  }
}
