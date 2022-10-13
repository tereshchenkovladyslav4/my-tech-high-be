import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProgramYearsAndSchoolPartnersFiltersOnAnnouncementTable1661267833210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD COLUMN \`filter_program_years\` VARCHAR(255) NULL DEFAULT NULL AFTER \`filter_users\`, ADD COLUMN \`filter_school_partners\` VARCHAR(255) NULL DEFAULT NULL AFTER \`filter_program_years\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`filter_program_years\`, DROP COLUMN \`filter_school_partners\``,
    );
  }
}
