import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchoolYearToSchoolPartners1659040405762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`school_partner\` ADD COLUMN \`school_year_id\` INT DEFAULT NULL AFTER \`region_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_partner', 'school_year_id');
  }
}
