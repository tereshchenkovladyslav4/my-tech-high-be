import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceCartTable1675481432865 implements MigrationInterface {
  name = 'UpdateResourceCartTable1675481432865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_543df35afcaca09c9a4fec92cf0\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_543df35afcaca09c9a4fec92cf0\` FOREIGN KEY (\`resource_level_id\`) REFERENCES \`mth_resource_level\`(\`resource_level_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_cart\` ADD CONSTRAINT \`FK_dca98ba7490e19092328c556c71\` FOREIGN KEY (\`resource_level_id\`) REFERENCES \`mth_resource_level\`(\`resource_level_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_dca98ba7490e19092328c556c71\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_543df35afcaca09c9a4fec92cf0\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_543df35afcaca09c9a4fec92cf0\` FOREIGN KEY (\`resource_level_id\`) REFERENCES \`mth_resource_level\`(\`resource_level_id\`) ON DELETE SET NULL ON UPDATE SET NULL`,
    );
  }
}
