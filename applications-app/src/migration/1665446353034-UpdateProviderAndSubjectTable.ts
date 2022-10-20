import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProviderAndSubjectTable1665446353034 implements MigrationInterface {
  name = 'UpdateProviderAndSubjectTable1665446353034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_provider\` ADD \`allow_request\` tinyint NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` ADD \`allow_request\` tinyint NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` ADD \`allow_request\` tinyint NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE \`mth_subject\` ADD \`allow_request\` tinyint NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_subject\` DROP COLUMN \`allow_request\``);
    await queryRunner.query(`ALTER TABLE \`mth_title\` DROP COLUMN \`allow_request\``);
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP COLUMN \`allow_request\``);
    await queryRunner.query(`ALTER TABLE \`mth_provider\` DROP COLUMN \`allow_request\``);
  }
}
