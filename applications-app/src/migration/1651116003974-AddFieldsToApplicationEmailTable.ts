import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsToApplicationEmailTable1651116003974
  implements MigrationInterface
{
  name = 'AddFieldsToApplicationEmailTable1651116003974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_application_email\` ADD \`from_email\` varchar(255) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_application_email\` ADD \`body\` varchar(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_application_email\` DROP COLUMN \`from_email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_application_email\` DROP COLUMN \`body\``,
    );
  }
}
