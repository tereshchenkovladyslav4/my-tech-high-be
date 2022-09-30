import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const name = 'mth_period';

export class period1664357659092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'school_year_id',
            type: 'int',
          },
          {
            name: 'period',
            type: 'int',
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'grade_level_min',
            type: 'varchar',
          },
          {
            name: 'grade_level_max',
            type: 'varchar',
          },
          {
            name: 'reduce_funds',
            type: 'enum',
            default: "'NONE'",
            enum: ['NONE', 'SUPPLEMENTAL', 'TECHNOLOGY'],
            comment: '0: NONE(default), 1: SUPPLEMENTAL, 2: TECHNOLOGY',
          },
          {
            name: 'price',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'semester',
            type: 'enum',
            default: "'NONE'",
            enum: ['NONE', 'PERIOD', 'SUBJECT'],
            comment: '0: NONE(default), 1: PERIOD, 2: SUBJECT',
          },
          {
            name: 'message_semester',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'message_period',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notify_semester',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'notify_period',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'archived',
            type: 'tinyint',
            default: 0,
            comment: '0: unarchive, 1: archived(default)',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      name,
      new TableForeignKey({
        columnNames: ['school_year_id'],
        referencedColumnNames: ['school_year_id'],
        referencedTableName: 'mth_schoolyear',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mth_period');
  }
}
