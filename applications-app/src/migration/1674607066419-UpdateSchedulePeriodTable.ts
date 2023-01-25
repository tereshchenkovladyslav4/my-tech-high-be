import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchedulePeriodTable1674607066419 implements MigrationInterface {
  name = 'UpdateSchedulePeriodTable1674607066419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`custom_build_description\` \`custom_build_description\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`custom_build_description\` \`custom_build_description\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` CHANGE \`custom_build_description\` \`custom_build_description\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` CHANGE \`custom_build_description\` \`custom_build_description\` varchar(255) NULL`,
    );
  }
}
