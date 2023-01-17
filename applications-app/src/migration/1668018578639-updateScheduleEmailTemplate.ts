import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateScheduleEmailTemplate1668018578639 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts = "parent,student,year" WHERE category_id = 4 AND template_name IN ("2nd Semester Accepted", "2nd Semester Unlocked")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts = "parent" WHERE category_id = 4 AND template_name IN ("2nd Semester Accepted", "2nd Semester Unlocked")`,
    );
  }
}
