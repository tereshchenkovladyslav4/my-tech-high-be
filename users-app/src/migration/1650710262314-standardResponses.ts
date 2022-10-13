import { MigrationInterface, QueryRunner } from 'typeorm';

export class standardResponses1650710262314 implements MigrationInterface {
  name = 'standardResponses1650710262314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` ADD \`standard_responses\` text DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_templates\` DROP COLUMN \`standard_responses\``);
  }
}
