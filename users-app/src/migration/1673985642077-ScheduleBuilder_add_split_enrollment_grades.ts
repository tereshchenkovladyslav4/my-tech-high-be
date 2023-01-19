import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScheduleBuilderAddSplitEnrollmentGrades1673985642077 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE mth_schedule_builder ADD COLUMN split_enrollment_grades VARCHAR(63) NULL AFTER split_enrollment`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mth_schedule_builder DROP COLUMN split_enrollment_grades`);
  }
}
