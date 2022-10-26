import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScheduleTable1666798428262 implements MigrationInterface {
  name = 'CreateScheduleTable1666798428262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_schedule\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule\` (\`schedule_id\` int NOT NULL AUTO_INCREMENT, \`StudentId\` int NULL, \`SchoolYearId\` int NULL, \`status\` varchar(255) NULL, \`date_accepted\` datetime NULL, \`last_modified\` datetime NULL, \`date_submitted\` datetime NULL, \`current_submission\` datetime NULL, PRIMARY KEY (\`schedule_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_6cefdd40006d952020c01822e52\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_19cc6debd9dc9b7d8189b085025\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_19cc6debd9dc9b7d8189b085025\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_6cefdd40006d952020c01822e52\``);
    await queryRunner.query(`DROP TABLE \`mth_schedule\``);
  }
}
