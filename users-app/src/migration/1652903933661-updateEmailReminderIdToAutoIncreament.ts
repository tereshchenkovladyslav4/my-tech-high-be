import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEmailReminderIdToAutoIncreament1652903933661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_reminder\` MODIFY \`reminder_id\` int NOT NULL AUTO_INCREMENT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_reminder\` MODIFY \`reminder_id\` int NOT NULL`);
  }
}
