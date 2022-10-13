import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEmailReminderDeadlineToReminder1652887425753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_reminder\` DROP COLUMN \`deadline\``);
    await queryRunner.query(`ALTER TABLE \`email_reminder\` ADD COLUMN \`reminder\` int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_reminder\` ADD COLUMN \`deadline\` int`);
    await queryRunner.query(`ALTER TABLE \`email_reminder\` DROP COLUMN \`reminder\``);
  }
}
