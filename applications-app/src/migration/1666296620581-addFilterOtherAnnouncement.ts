import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFilterOtherAnnouncement1666296620581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`announcement\` ADD \`filter_others\` VARCHAR(170)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`announcement\` DROP COLUMN \`filter_others\``);
  }
}
