import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionIdAndAdditionalQuestionsColumnsToApplicationTable1650559307722 implements MigrationInterface {
  name = 'AddRegionIdAndAdditionalQuestionsColumnsToApplicationTable1650559307722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application\` ADD \`meta\` longtext NULL DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application\` DROP COLUMN \`meta\``);
  }
}
