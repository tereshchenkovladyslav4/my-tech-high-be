import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScheduleHistoryAndSchedulePeriodHistoryTable1668128735503 implements MigrationInterface {
  name = 'CreateScheduleHistoryAndSchedulePeriodHistoryTable1668128735503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule_period_history\` (\`schedule_period_history_id\` int NOT NULL AUTO_INCREMENT, \`ScheduleHistoryId\` int NULL, \`PeriodId\` int NULL, \`SubjectId\` int NULL, \`TitleId\` int NULL, \`ProviderId\` int NULL, \`CourseId\` int NULL, \`course_type\` varchar(255) NULL, \`custom_build_description\` varchar(255) NULL, \`tp_provider_name\` varchar(255) NULL, \`tp_course_name\` varchar(255) NULL, \`tp_phone_number\` varchar(255) NULL, \`tp_specific_course_website\` varchar(255) NULL, \`tp_addtional_specific_course_website\` varchar(255) NULL, \`osse_coures_name\` varchar(255) NULL, \`osse_district_school\` varchar(255) NULL, \`osse_school_district_name\` varchar(255) NULL, \`update_required\` tinyint NULL, PRIMARY KEY (\`schedule_period_history_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule_history\` (\`schedule_history_id\` int NOT NULL AUTO_INCREMENT, \`StudentId\` int NULL, \`SchoolYearId\` int NULL, \`status\` varchar(255) NULL, \`is_second_semester\` tinyint NULL, \`date_accepted\` datetime NULL, PRIMARY KEY (\`schedule_history_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_798842bc82c275715a3a36fa71c\` FOREIGN KEY (\`ScheduleHistoryId\`) REFERENCES \`mth_schedule_history\`(\`schedule_history_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_89a8fdb300ae5f27f3e458d983b\` FOREIGN KEY (\`PeriodId\`) REFERENCES \`mth_period\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_9f93652d8b6d82b5d70e951fc17\` FOREIGN KEY (\`SubjectId\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_3fb3050fda079228e2ca9a4b231\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_00db1572fcb7b71578dda5ee0e5\` FOREIGN KEY (\`ProviderId\`) REFERENCES \`mth_provider\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` ADD CONSTRAINT \`FK_c4cecaa68d7dd92be77abdc593a\` FOREIGN KEY (\`CourseId\`) REFERENCES \`mth_course\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_history\` ADD CONSTRAINT \`FK_cc57b07ca0394f0036971f214ba\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_history\` ADD CONSTRAINT \`FK_8a2043f0e157f961945a944677a\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_history\` DROP FOREIGN KEY \`FK_8a2043f0e157f961945a944677a\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_history\` DROP FOREIGN KEY \`FK_cc57b07ca0394f0036971f214ba\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_c4cecaa68d7dd92be77abdc593a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_00db1572fcb7b71578dda5ee0e5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_3fb3050fda079228e2ca9a4b231\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_9f93652d8b6d82b5d70e951fc17\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_89a8fdb300ae5f27f3e458d983b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period_history\` DROP FOREIGN KEY \`FK_798842bc82c275715a3a36fa71c\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_schedule_history\``);
    await queryRunner.query(`DROP TABLE \`mth_schedule_period_history\``);
  }
}
