import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUpdateAllowEmailTemplate1677276464032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET template="standard_modal" WHERE template_name = "Updates Allowed"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE email_templates SET template="standard" WHERE template_name = "Updates Allowed"`);
  }
}
