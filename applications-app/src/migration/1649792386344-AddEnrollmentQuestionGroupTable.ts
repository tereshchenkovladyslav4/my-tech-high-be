import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddEnrollmentQuestionGroupTable1649792386344
  implements MigrationInterface
{
  name = 'AddEnrollmentQuestionGroupTable1649792386344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mth_enrollment_question_group',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tab_id',
            type: 'int',
          },
          {
            name: 'group_name',
            type: 'varchar',
          },
          {
            name: 'order',
            type: 'int',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mth_enrollment_question_group');
  }
}
