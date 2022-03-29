import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateGlobalSettingsTable1646559248218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'mth_settings',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
              },
              {
                name: 'enable_immunizations',
                type: 'int',
              }
            ],
          }),
          true,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('mth_settings');
      }
    }
    