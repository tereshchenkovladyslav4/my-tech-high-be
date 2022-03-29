import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EmailCategoryTable1647614989665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_category',
        columns: [
          {
            name: 'category_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'category_name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_category');
  }
}
