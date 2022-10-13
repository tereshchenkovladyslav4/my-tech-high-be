import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceRequestTable1660687205379 implements MigrationInterface {
  name = 'CreateResourceRequestTable1660687205379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_request\` (\`student_id\` int NOT NULL, \`resource_id\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`student_id\`, \`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_58442ed566b2767b173c2464e7d\` FOREIGN KEY (\`student_id\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_102c2ccc67887e6ee64698fad57\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_102c2ccc67887e6ee64698fad57\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_58442ed566b2767b173c2464e7d\``);
    await queryRunner.query(`DROP TABLE \`mth_resource_request\``);
  }
}
