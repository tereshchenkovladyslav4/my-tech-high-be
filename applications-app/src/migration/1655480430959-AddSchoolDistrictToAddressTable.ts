import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchoolDistrictToAddressTable1655480430959 implements MigrationInterface {
  name = 'AddSchoolDistrictToAddressTable1655480430959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` ADD \`school_district\` varchar(255) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` DROP COLUMN \`school_district\``);
  }
}
