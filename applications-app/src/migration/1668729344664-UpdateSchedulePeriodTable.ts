import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchedulePeriodTable1668729344664 implements MigrationInterface {
  name = 'UpdateSchedulePeriodTable1668729344664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD \`status\` enum ('UPDATE_REQUESTED') NULL COMMENT 'UPDATE_REQUESTED: Update Requested by Parent'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`osse_coures_name\` \`osse_course_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`tp_addtional_specific_course_website\` \`tp_additional_specific_course_website\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`osse_coures_name\` \`osse_course_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`tp_addtional_specific_course_website\` \`tp_additional_specific_course_website\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`osse_course_name\` \`osse_coures_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`tp_additional_specific_course_website\` \`tp_addtional_specific_course_website\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`osse_course_name\` \`osse_coures_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`tp_additional_specific_course_website\` \`tp_addtional_specific_course_website\` varchar(255) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP COLUMN \`status\``);
  }
}
