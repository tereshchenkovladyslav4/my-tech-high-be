import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedFileNameFieldChecklistTable1676667469683 implements MigrationInterface {
  name = 'addedFileNameFieldChecklistTable1676667469683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_checklist\` ADD \`file_name\` varchar(255) NOT NULL`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_checklist\` DROP COLUMN \`file_name\``);
  }
}
