import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTable1655063344049 implements MigrationInterface {
  name = 'CreateEventTable1655063344049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_event\` (\`event_id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NULL, \`TypeId\` int NULL, \`start_date\` varchar(255) NULL, \`end_date\` varchar(255) NULL, \`time\` varchar(255) NULL, \`filter_grades\` varchar(255) NULL, \`filter_program_year\` varchar(255) NULL, \`filter_users\` varchar(255) NULL, \`filter_school_of_enrollment\` varchar(255) NULL, \`filter_other\` varchar(255) NULL, \`filter_provider\` varchar(255) NULL, \`description\` text NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`event_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` ADD CONSTRAINT \`FK_ba92ff037a3adc96509cb164c81\` FOREIGN KEY (\`TypeId\`) REFERENCES \`mth_event_type\`(\`event_type_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` DROP FOREIGN KEY \`FK_ba92ff037a3adc96509cb164c81\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_event\``);
  }
}
