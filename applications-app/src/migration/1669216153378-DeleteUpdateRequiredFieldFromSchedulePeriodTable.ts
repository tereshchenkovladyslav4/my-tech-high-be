import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteUpdateRequiredFieldFromSchedulePeriodTable1669216153378 implements MigrationInterface {
  name = 'DeleteUpdateRequiredFieldFromSchedulePeriodTable1669216153378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`update_required\` \`status\` tinyint NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP COLUMN \`update_required\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period_history\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED') NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED') NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period_history\` DROP COLUMN \`status\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period_history\` ADD \`status\` tinyint NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` ADD \`update_required\` tinyint NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`status\` \`update_required\` tinyint NULL`,
    );
  }
}
