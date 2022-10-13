import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwoNewColumnsToEmailTemplateTable1651613371752 implements MigrationInterface {
  name = 'AddTwoNewColumnsToEmailTemplateTable1651613371752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` ADD \`template\` VARCHAR(45) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE \`email_templates\` ADD \`inserts\` VARCHAR(100) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` DROP COLUMN \`template\``);
    await queryRunner.query(`ALTER TABLE \`email_templates\` DROP COLUMN \`inserts\``);
  }
}
