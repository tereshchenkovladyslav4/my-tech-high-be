import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceSettingsTable1659470507074
  implements MigrationInterface
{
  name = 'CreateResourceSettingsTable1659470507074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource\` DROP FOREIGN KEY \`FK_9bac4ea97bfc1bc39cc03750a94\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_resource\``);
    await queryRunner.query(`DROP TABLE \`mth_resource_settings\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`school_year_id\` \`school_year_id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_settings\` (\`resource_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`title\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`subtitle\` varchar(255) NOT NULL, \`price\` decimal(13,2) NULL, \`website\` varchar(100) NULL, \`grades\` varchar(255) NOT NULL, \`std_user_name\` varchar(255) NOT NULL, \`std_password\` varchar(255) NOT NULL, \`detail\` text NULL, \`priority\` int NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`resource_limit\` int NULL, \`add_resource_level\` tinyint NULL, \`resource_level\` varchar(255) NULL, \`family_resource\` tinyint NULL, PRIMARY KEY (\`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` ADD CONSTRAINT \`FK_15155ce688722bc565a2d1339c7\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_resource\` (\`resource_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`title\` varchar(255) NOT NULL, \`show_cost\` tinyint NOT NULL, \`cost\` int NULL, \`image\` varchar(255) NOT NULL, \`sequence\` int NULL, \`website\` varchar(100) NULL, \`hidden\` tinyint NOT NULL, \`allow_request\` tinyint NOT NULL, PRIMARY KEY (\`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`school_year_id\` \`school_year_id\` int UNSIGNED NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource\` ADD CONSTRAINT \`FK_9bac4ea97bfc1bc39cc03750a94\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` DROP FOREIGN KEY \`FK_15155ce688722bc565a2d1339c7\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_resource_settings\``);
  }
}
