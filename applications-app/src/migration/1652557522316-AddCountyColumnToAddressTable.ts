import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountyColumnToAddressTable1652557522316
  implements MigrationInterface
{
  name = 'AddCountyColumnToAddressTable1652557522316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_address\` ADD \`county_id\` INT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_address\` DROP COLUMN \`county_id\``,
    );
  }
}
