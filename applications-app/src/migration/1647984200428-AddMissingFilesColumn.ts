import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingFilesColumn1647984200428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` ADD COLUMN \`missing_files\` VARCHAR(255)  NULL DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mth_packet', 'missing_files');
  }
}
