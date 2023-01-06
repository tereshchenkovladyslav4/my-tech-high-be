import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceRequestEmailTable1672867161200 implements MigrationInterface {
  name = 'CreateResourceRequestEmailTable1672867161200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_resource_request\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`student_id\` int NOT NULL, \`resource_id\` int NOT NULL, \`resource_level_id\` int NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_request_email\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resource_request_id\` int NOT NULL, \`email_record_id\` int NOT NULL, \`subject\` varchar(255) NOT NULL, \`body\` text NULL, \`from_email\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` ADD CONSTRAINT \`FK_68e3c4c10e25c8ae89572501e3b\` FOREIGN KEY (\`resource_request_id\`) REFERENCES \`mth_resource_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` ADD CONSTRAINT \`FK_53a01fc74e7bcdef7e07d72d966\` FOREIGN KEY (\`email_record_id\`) REFERENCES \`mth_email_records\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` DROP FOREIGN KEY \`FK_53a01fc74e7bcdef7e07d72d966\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` DROP FOREIGN KEY \`FK_68e3c4c10e25c8ae89572501e3b\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_resource_request_email\``);
  }
}
