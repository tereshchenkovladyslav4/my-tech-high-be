import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EmailReminderTable1651174921213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_reminder',
        columns: [
          {
            name: 'reminder_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'email_template_id',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'subject',
            type: 'varchar',
          },
          {
            name: 'body',
            type: 'text',
          },
          {
            name: 'deadline',
            type: 'int',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_reminder');
  }
}
