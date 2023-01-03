import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletePriorityFromTitleTable1672330547656 implements MigrationInterface {
  name = 'DeletePriorityFromTitleTable1672330547656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_title\` DROP COLUMN \`priority\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_title\` ADD \`priority\` int NULL`);
  }
}
