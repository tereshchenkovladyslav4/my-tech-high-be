import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAllDayFieldToEventTable1656905316000 implements MigrationInterface {
  name = 'AddAllDayFieldToEventTable1656905316000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`all_day\` tinyint NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`all_day\``);
  }
}
