import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsAgeIssueColumn1646777842347 implements MigrationInterface {
      public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE \`mth_packet\` ADD \`is_age_issue\` tinyint NOT NULL DEFAULT 0`,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE \`mth_packet\` DROP COLUMN \`is_age_issue\``,
        );
      }
    }
    