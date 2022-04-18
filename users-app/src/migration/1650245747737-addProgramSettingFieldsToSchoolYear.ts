import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProgramSettingFieldsToSchoolYear1650245747737
  implements MigrationInterface
{
  name = 'addProgramSettingFieldsToSchoolYear1650245747737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`region\` DROP COLUMN \`birth_date\``,
    );
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`grades\``);
    await queryRunner.query(
      `ALTER TABLE \`region\` DROP COLUMN \`special_ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`birth_date_cut\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`special_ed\` tinyint(1) NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD \`grades\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`grades\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`special_ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`birth_date_cut\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`region\` ADD \`special_ed\` tinyint(1) NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`region\` ADD \`grades\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`region\` ADD \`birth_date\` varchar(255) NULL`,
    );
  }
}
