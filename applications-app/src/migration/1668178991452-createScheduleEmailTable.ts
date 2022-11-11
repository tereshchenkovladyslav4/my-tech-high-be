import { MigrationInterface, QueryRunner } from 'typeorm';

export class createScheduleEmailTable1668184769584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule_email\` (\`schedule_email_id\` int NOT NULL AUTO_INCREMENT, \`schedule_id\` int(11) NOT NULL, \`subject\` varchar(100) NOT NULL, \`from_email\` varchar(100) NOT NULL, \`body\` varchar(300) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (\`schedule_email_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` ADD CONSTRAINT \`mth_schedule_email_ibfk_1\` FOREIGN KEY (\`schedule_id\`) REFERENCES  \`mth_schedule\`(\`schedule_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_schedule_email\``);
  }
}
