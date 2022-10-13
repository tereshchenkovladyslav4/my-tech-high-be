import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionIdColumnToEmailTemplateTable1651676034265 implements MigrationInterface {
  name = 'AddRegionIdColumnToEmailTemplateTable1651676034265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` ADD \`region_id\` INT(11) NOT NULL DEFAULT 1`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` DROP COLUMN \`region_id\``);
  }
}
