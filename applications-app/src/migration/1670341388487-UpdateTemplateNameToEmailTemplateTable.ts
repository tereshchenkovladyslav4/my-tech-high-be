import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTemplateNameToEmailTemplateTable1670341388487 implements MigrationInterface {
  name = 'UpdateTemplateNameToEmailTemplateTable1670341388487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE infocenter.email_templates SET template_name = 'Notify of Withdraw' WHERE template_name = 'Notify of Withdrawal'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE infocenter.email_templates SET template_name = 'Notify of Withdrawal' template_name = 'Notify of Withdraw'`,
    );
  }
}
