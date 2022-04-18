import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddEnrollmentQuestionTabTable1649791982353
  implements MigrationInterface
{
  name = 'AddEnrollmentQuestionTabTable1649791982353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mth_enrollment_question_tab',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tab_name',
            type: 'varchar',
          },
          {
            name: 'is_active',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'region_id',
            type: 'int',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mth_enrollment_question_tab');
  }
}
