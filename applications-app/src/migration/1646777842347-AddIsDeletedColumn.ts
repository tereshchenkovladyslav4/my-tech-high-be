import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsDeletedColumn1646777842347 implements MigrationInterface {
      public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE \`mth_immunization_settings\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE \`mth_immunization_settings\` DROP COLUMN \`is_deleted\``,
        );
      }
    }
    