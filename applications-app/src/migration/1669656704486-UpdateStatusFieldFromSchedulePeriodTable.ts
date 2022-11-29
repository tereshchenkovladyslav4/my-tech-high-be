import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStatusFieldFromSchedulePeriodTable1669656704486 implements MigrationInterface {
  name = 'UpdateStatusFieldFromSchedulePeriodTable1669656704486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED', 'NO_UPDATES', 'MAKE_UPDATES') NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED', 'NO_UPDATES', 'MAKE_UPDATES') NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`status\` \`status\` enum ('UPDATE_REQUESTED', 'UPDATE_REQUIRED', 'RESUBMITTED') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin'`,
    );
  }
}
