import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEmailTemplateType1645538486218
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` CHANGE \`email_update_template\` \`email_update_template\` longtext NULL DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` CHANGE \`email_update_template\` \`email_update_template\` varchar(40) NULL DEFAULT NULL`,
    );
  }
}
