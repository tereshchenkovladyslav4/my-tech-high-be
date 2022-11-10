import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForeignKeys1667883688746 implements MigrationInterface {
  name = 'UpdateForeignKeys1667883688746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` DROP FOREIGN KEY \`FK_938d576f2a5cc034d39a13361e5\``);

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_6d0127824ab72727f908cc8b40f\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_9286cf7c79dc5e0cd508cbcf964\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` DROP FOREIGN KEY \`FK_d8544945d9626b644f385920a72\``,
    );

    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_19cc6debd9dc9b7d8189b085025\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_6cefdd40006d952020c01822e52\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_2d2a9b4f6c4a4dff58ab2d60dee\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_332ac1598d957f669f860d0754c\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ada9245272bf4871717e5cd195f\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ffb9e12cff3a2da7cdaaa061386\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_66d44c8b8f82f92d6c360109e84\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_01bad105d3462e3ef2d532bf247\``);

    await queryRunner.query(`TRUNCATE \`mth_assessment\``);

    await queryRunner.query(`TRUNCATE \`mth_student_assessment_option\``);

    await queryRunner.query(`TRUNCATE \`mth_assessment_option\``);

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment\` ADD CONSTRAINT \`FK_938d576f2a5cc034d39a13361e5\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_6d0127824ab72727f908cc8b40f\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_9286cf7c79dc5e0cd508cbcf964\` FOREIGN KEY (\`OptionId\`) REFERENCES \`mth_assessment_option\`(\`option_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` ADD CONSTRAINT \`FK_d8544945d9626b644f385920a72\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_19cc6debd9dc9b7d8189b085025\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_6cefdd40006d952020c01822e52\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_01bad105d3462e3ef2d532bf247\` FOREIGN KEY (\`ScheduleId\`) REFERENCES \`mth_schedule\`(\`schedule_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_66d44c8b8f82f92d6c360109e84\` FOREIGN KEY (\`PeriodId\`) REFERENCES \`mth_period\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_ffb9e12cff3a2da7cdaaa061386\` FOREIGN KEY (\`SubjectId\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_ada9245272bf4871717e5cd195f\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_332ac1598d957f669f860d0754c\` FOREIGN KEY (\`ProviderId\`) REFERENCES \`mth_provider\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_period\` ADD CONSTRAINT \`FK_2d2a9b4f6c4a4dff58ab2d60dee\` FOREIGN KEY (\`CourseId\`) REFERENCES \`mth_course\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` DROP FOREIGN KEY \`FK_938d576f2a5cc034d39a13361e5\``);

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_6d0127824ab72727f908cc8b40f\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_9286cf7c79dc5e0cd508cbcf964\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` DROP FOREIGN KEY \`FK_d8544945d9626b644f385920a72\``,
    );

    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_19cc6debd9dc9b7d8189b085025\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule\` DROP FOREIGN KEY \`FK_6cefdd40006d952020c01822e52\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_2d2a9b4f6c4a4dff58ab2d60dee\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_332ac1598d957f669f860d0754c\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ada9245272bf4871717e5cd195f\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_ffb9e12cff3a2da7cdaaa061386\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_66d44c8b8f82f92d6c360109e84\``);

    await queryRunner.query(`ALTER TABLE \`mth_schedule_period\` DROP FOREIGN KEY \`FK_01bad105d3462e3ef2d532bf247\``);

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment\` ADD CONSTRAINT \`FK_938d576f2a5cc034d39a13361e5\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_6d0127824ab72727f908cc8b40f\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_9286cf7c79dc5e0cd508cbcf964\` FOREIGN KEY (\`OptionId\`) REFERENCES \`mth_assessment_option\`(\`option_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` ADD CONSTRAINT \`FK_d8544945d9626b644f385920a72\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_19cc6debd9dc9b7d8189b085025\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`mth_schedule\` ADD CONSTRAINT \`FK_6cefdd40006d952020c01822e52\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
}
