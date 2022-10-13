import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUploadedByToFileTable1646236992732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_file\` ADD COLUMN \`uploaded_by\` INT(11) UNSIGNED NULL DEFAULT NULL AFTER \`is_new_upload_type\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mth_file', 'uploaded_by');
  }
}
