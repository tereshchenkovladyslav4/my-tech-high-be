import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateRequiredFieldToSchedulePeriodTable1667540287750 implements MigrationInterface {
  name = 'AddUpdateRequiredFieldToSchedulePeriodTable1667540287750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` ADD \`update_required\` tinyint NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP COLUMN \`update_required\``);
  }
}
