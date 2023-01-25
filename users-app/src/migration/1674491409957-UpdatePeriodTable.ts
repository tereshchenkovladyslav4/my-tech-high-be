import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePeriodTable1674491409957 implements MigrationInterface {
  name = 'UpdatePeriodTable1674491409957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_period\` ADD \`diploma_seeking_path\` varchar(255) NULL`);
    await queryRunner.query(`UPDATE \`mth_period\` SET \`diploma_seeking_path\` = 'both' WHERE \`id\` > 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_period\` DROP COLUMN \`diploma_seeking_path\``);
  }
}
