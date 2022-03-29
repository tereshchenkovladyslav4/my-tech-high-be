import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddApplicationQuestion1647778274813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mth_application_question',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'required',
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
    await queryRunner.dropTable('mth_application_question');
  }
}
