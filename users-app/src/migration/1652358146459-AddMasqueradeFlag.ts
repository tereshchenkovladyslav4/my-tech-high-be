import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMasqueradeFlag1652358146459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`core_users\` ADD \`masquerade\` int DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`core_users\` DROP COLUMN \`masquerade\``);
  }
}
