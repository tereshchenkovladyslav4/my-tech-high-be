import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecreateResourceRequestTable1670025875416 implements MigrationInterface {
  name = 'RecreateResourceRequestTable1670025875416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_resource_request\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_request\` (\`student_id\` int NOT NULL, \`resource_id\` int NOT NULL, \`resource_level_id\` int NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`student_id\`, \`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_58442ed566b2767b173c2464e7d\` FOREIGN KEY (\`student_id\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_102c2ccc67887e6ee64698fad57\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_543df35afcaca09c9a4fec92cf0\` FOREIGN KEY (\`resource_level_id\`) REFERENCES \`mth_resource_level\`(\`resource_level_id\`) ON DELETE SET NULL ON UPDATE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_543df35afcaca09c9a4fec92cf0\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_102c2ccc67887e6ee64698fad57\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_58442ed566b2767b173c2464e7d\``);
    await queryRunner.query(`DROP TABLE \`mth_resource_request\``);
  }
}
