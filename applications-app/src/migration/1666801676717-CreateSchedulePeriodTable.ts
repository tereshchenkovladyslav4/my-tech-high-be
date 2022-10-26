import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchedulePeriodTable1666801676717 implements MigrationInterface {
  name = 'CreateSchedulePeriodTable1666801676717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_schedule_period\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_schedule_period\` (\`schedule_period_id\` int NOT NULL AUTO_INCREMENT, \`ScheduleId\` int NULL, \`PeriodId\` int NULL, \`SubjectId\` int NULL, \`TitleId\` int NULL, \`ProviderId\` int NULL, \`CourseId\` int NULL, \`course_type\` varchar(255) NULL, \`custom_build_description\` varchar(255) NULL, \`tp_provider_name\` varchar(255) NULL, \`tp_course_name\` varchar(255) NULL, \`tp_phone_number\` varchar(255) NULL, \`tp_specific_course_website\` varchar(255) NULL, \`tp_addtional_specific_course_website\` varchar(255) NULL, \`osse_coures_name\` varchar(255) NULL, \`osse_district_school\` varchar(255) NULL, \`osse_school_district_name\` varchar(255) NULL, PRIMARY KEY (\`schedule_period_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_01bad105d3462e3ef2d532bf247\` FOREIGN KEY (\`ScheduleId\`) REFERENCES \`mth_schedule\`(\`schedule_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_66d44c8b8f82f92d6c360109e84\` FOREIGN KEY (\`PeriodId\`) REFERENCES \`mth_period\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_ffb9e12cff3a2da7cdaaa061386\` FOREIGN KEY (\`SubjectId\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_ada9245272bf4871717e5cd195f\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_332ac1598d957f669f860d0754c\` FOREIGN KEY (\`ProviderId\`) REFERENCES \`mth_provider\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_2d2a9b4f6c4a4dff58ab2d60dee\` FOREIGN KEY (\`CourseId\`) REFERENCES \`mth_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_2d2a9b4f6c4a4dff58ab2d60dee\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_332ac1598d957f669f860d0754c\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ada9245272bf4871717e5cd195f\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ffb9e12cff3a2da7cdaaa061386\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_66d44c8b8f82f92d6c360109e84\``);
    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_01bad105d3462e3ef2d532bf247\``);
    await queryRunner.query(`DROP TABLE \`mth_schedule_period\``);
  }
}
