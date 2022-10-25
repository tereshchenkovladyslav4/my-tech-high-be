import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduleAcceptEmail1666647780178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts = "parent,student,year" WHERE category_id = 4 AND title="Accepted"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE email_templates SET inserts = "parent" WHERE category_id = 4 AND title="Accepted"`);
  }
}
