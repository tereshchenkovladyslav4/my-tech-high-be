import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBodyFieldFromScheduleEmailTable1669913728036 implements MigrationInterface {
  name = 'UpdateBodyFieldFromScheduleEmailTable1669913728036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_schedule_email\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule_email\` (\`schedule_email_id\` int NOT NULL AUTO_INCREMENT, \`schedule_id\` int NOT NULL, \`subject\` varchar(255) NOT NULL, \`body\` text NULL, \`from_email\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`schedule_email_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` ADD CONSTRAINT \`FK_d42e930cd8df811a5cca5e4a441\` FOREIGN KEY (\`schedule_id\`) REFERENCES \`mth_schedule\`(\`schedule_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_email\` DROP FOREIGN KEY \`FK_d42e930cd8df811a5cca5e4a441\``);
    await queryRunner.query(`DROP TABLE \`mth_schedule_email\``);
  }
}
