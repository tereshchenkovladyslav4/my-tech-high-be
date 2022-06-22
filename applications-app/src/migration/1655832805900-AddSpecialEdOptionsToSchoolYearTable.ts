import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialEdOptionsToSchoolYearTable1655832805900
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`special_ed_options\` varchar(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`special_ed_options\``,
    );
  }
}
