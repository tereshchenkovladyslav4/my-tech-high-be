import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceCartTable1662111772067 implements MigrationInterface {
  name = 'UpdateResourceCartTable1662111772067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\`
          ADD \`resource_level_id\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\`
          ADD \`resource_level_id\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP COLUMN \`resource_level_id\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\` DROP COLUMN \`resource_level_id\``);
  }
}
