import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateEmailRecordsTable1659513091038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'mth_email_records',
              columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'from_email',
                    type: 'varchar',
                },
                {
                    name: 'to_email',
                    type: 'varchar',
                },
                {
                    name: 'subject',
                    type: 'varchar',
                },
                {
                    name: 'template_name',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: true,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('mth_email_records');
    }

}
