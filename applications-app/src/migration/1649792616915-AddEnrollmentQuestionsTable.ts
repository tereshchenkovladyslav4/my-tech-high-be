import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddEnrollmentQuestionsTable1649792616915 implements MigrationInterface {
  name = 'AddEnrollmentQuestionsTable1649792616915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mth_enrollment_questions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'group_id',
            type: 'int',
          },
          {
            name: 'type',
            type: 'int',
          },
          {
            name: 'order',
            type: 'int',
          },
          {
            name: 'question',
            type: 'varchar',
          },
          {
            name: 'options',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'additional',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'additional2',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'required',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'removable',
            type: 'tinyint',
            default: 0,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mth_enrollment_questions');
  }
}
