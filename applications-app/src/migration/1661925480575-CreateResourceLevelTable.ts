import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceLevelTable1661925480575
  implements MigrationInterface
{
  name = 'CreateResourceLevelTable1661925480575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_level\` (\`resource_level_id\` int NOT NULL AUTO_INCREMENT, \`resource_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`limit\` int NULL, \`created_at\` datetime NOT NULL default CURRENT_TIMESTAMP, PRIMARY KEY (\`resource_level_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_level\` ADD CONSTRAINT \`FK_8273937b0816d7821c5fb99ce8a\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` DROP COLUMN \`resource_level\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_settings\` ADD \`resource_level\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_level\` DROP FOREIGN KEY \`FK_8273937b0816d7821c5fb99ce8a\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_resource_level\``);
  }
}
