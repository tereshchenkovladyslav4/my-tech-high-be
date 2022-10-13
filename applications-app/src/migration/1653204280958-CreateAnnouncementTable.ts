import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnnouncementTable1653204280958 implements MigrationInterface {
  name = 'CreateAnnouncementTable1653204280958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`announcement\` (\`announcement_id\` int NOT NULL AUTO_INCREMENT, \`RegionId\` int NULL, \`status\` varchar(255) NULL, \`posted_by\` varchar(255) NULL, \`schedule_time\` datetime NULL, \`subject\` varchar(255) NULL, \`body\` text NULL, \`filter_grades\` varchar(255) NULL, \`filter_users\` varchar(255) NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`announcement_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD CONSTRAINT \`FK_480684abccae6be52d94e3e1aaf\` FOREIGN KEY (\`RegionId\`) REFERENCES \`region\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_application_email\` CHANGE \`body\` \`body\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`announcement\` DROP FOREIGN KEY \`FK_480684abccae6be52d94e3e1aaf\``);
    await queryRunner.query(`DROP TABLE \`announcement\``);
    await queryRunner.query(`ALTER TABLE \`mth_application_email\` CHANGE \`body\` \`body\` VARCHAR(255) NULL`);
  }
}
