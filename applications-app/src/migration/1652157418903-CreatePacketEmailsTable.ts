import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePacketEmailsTable1652157418903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'mth_packet_email',
              columns: [
                {
                  name: 'packet_email_id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'packet_id',
                  type: 'int',
                },
                {
                  name: 'subject',
                  type: 'varchar',
                  default: null,
                },
                {
                  name: 'from_email',
                  type: 'varchar',
                  default: null,
                },
                {
                  name: 'body',
                  type: 'text',
                  default: null
                },
                {
                  name: 'created_at',
                  type: 'timestamp',
                  default: 'now()',
                }
              ],
            }),
            true,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('mth_packet_email');
    }

}
