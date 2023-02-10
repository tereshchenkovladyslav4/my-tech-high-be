import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHomeroomSettingsTable1675973985057 implements MigrationInterface {
  name = 'CreateHomeroomSettingsTable1675973985057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_homeroom_settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`days_to_submit_early\` int NULL, \`max_of_excused_learning_logs_allowed\` int NULL, \`grading_scale_percentage\` int NULL, \`passing_average\` int NULL, \`grades_by_subject\` tinyint NULL, \`notify_when_graded\` tinyint NULL, \`update_required_schedule_to_sumbit\` tinyint NULL, \`notify_when_resubmit_required\` tinyint NULL, \`gender\` tinyint NULL, \`special_education\` tinyint NULL, \`diploma\` tinyint NULL, \`zero_count\` tinyint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_homeroom_settings\` ADD CONSTRAINT \`FK_688933c78f6ad15b74dd1529532\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_homeroom_settings\` DROP FOREIGN KEY \`FK_688933c78f6ad15b74dd1529532\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_homeroom_settings\``);
  }
}
