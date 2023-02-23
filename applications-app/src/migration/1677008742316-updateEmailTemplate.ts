import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEmailTemplate1677008742316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts="parent,student,year,instructions,link" WHERE template_name IN ("Updates Required","Updates Allowed","2nd Semester Unlocked")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts="parent,student,year" WHERE template_name IN ("Updates Required","Updates Allowed","2nd Semester Unlocked")`,
    );
  }
}
