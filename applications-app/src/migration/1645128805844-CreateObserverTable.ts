import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateObserverTable1645128805844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mth_observer',
        columns: [
          {
            name: 'observer_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'parent_id',
            type: 'int',
          },
          {
            name: 'person_id',
            type: 'int',
          },
          {
            name: 'student_id',
            type: 'int',
          },
          {
            name: 'notes',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mth_observer');
  }
}
