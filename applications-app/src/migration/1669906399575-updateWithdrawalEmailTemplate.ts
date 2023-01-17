import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateWithdrawalEmailTemplate1669906399575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE email_templates ADD priority INT DEFAULT 0`);
    await queryRunner.query(`UPDATE email_category SET category_name="Withdrawal" WHERE category_name="Withdraw"`);

    await queryRunner.query(
      `UPDATE email_templates SET title="Withdrawal Confirmation", priority = 1 WHERE template_name="Withdraw Confirmation"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Undeclared Withdrawal", priority = 2 WHERE template_name="Undeclared Withdraw"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Notify of Withdrawal", priority = 3 WHERE template_name="Notify of Withdraw"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Withdrawal Page", priority = 4 WHERE template_name="Withdraw Page"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET title="Withdraw Confirmation", priority = 0 WHERE template_name="Withdraw Confirmation"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Undeclared Withdraw", priority = 0 WHERE template_name="Undeclared Withdrawal"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Notify of Withdraw", priority = 0 WHERE template_name="Notify of Withdrawal"`,
    );
    await queryRunner.query(
      `UPDATE email_templates SET title="Withdraw Page", priority = 0 WHERE template_name="Withdrawal Page"`,
    );

    await queryRunner.query(`UPDATE email_category SET category_name="Withdraw" WHERE category_name="Withdrawal"`);
    await queryRunner.query(`ALTER TABLE email_templates DROP COLUMN priority`);
  }
}
