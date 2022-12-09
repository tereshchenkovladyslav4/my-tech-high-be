import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFilterProvdierInAnnouncement1670284221498 implements MigrationInterface {
  name = 'addFilterProvdierInAnnouncement1670284221498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`announcement\` ADD \`filter_providers\` varchar(255) NULL`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`announcement\` DROP COLUMN \`filter_providers\``);
  }
}
