import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceTable1675189354394 implements MigrationInterface {
  name = 'UpdateResourceTable1675189354394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_settings\` ADD \`std_username_format\` varchar(255) NULL`);
    await queryRunner.query(
      `UPDATE \`mth_resource_settings\` SET \`std_username_format\` = 'GENERIC' WHERE \`std_user_name\` <> ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_settings\` DROP COLUMN \`std_username_format\``);
  }
}
