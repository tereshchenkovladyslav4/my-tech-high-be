import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTestingPreferenceColumn1648753999208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD COLUMN \`testing_preference\` VARCHAR(255)  NULL DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mth_student', 'testing_preference');
  }
}
