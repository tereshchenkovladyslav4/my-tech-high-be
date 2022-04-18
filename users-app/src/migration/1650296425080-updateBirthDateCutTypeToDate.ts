import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateBirthDateCutTypeToDate1650296425080
  implements MigrationInterface
{
  name = 'updateBirthDateCutTypeToDate1650296425080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`birth_date_cut\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`birth_date_cut\` date DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`birth_date_cut\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`birth_date_cut\` varchar(45) DEFAULT NULL`,
    );
  }
}
