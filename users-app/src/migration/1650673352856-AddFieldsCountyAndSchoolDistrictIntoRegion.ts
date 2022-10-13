import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsCountyAndSchoolDistrictIntoRegion1650673352856 implements MigrationInterface {
  name = 'AddFieldsCountyAndSchoolDistrictIntoRegion1650673352856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`county_file_name\` varchar(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`county_file_path\` varchar(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`school_district_file_name\` varchar(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`school_district_file_path\` varchar(255) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`school_district_file_path\``);
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`school_district_file_name\``);
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`county_file_path\``);
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`county_file_name\``);
  }
}
