import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOneFieldToScheduleTable1668180980634 implements MigrationInterface {
  name = 'AddOneFieldToScheduleTable1668180980634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule\` ADD \`is_second_semester\` tinyint NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP COLUMN \`is_second_semester\``);
  }
}
