import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColToSchoolPartners1655154970411 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`school_partner\` ADD COLUMN \`photo\` VARCHAR(255) NULL DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_partner', 'photo');
  }
}
