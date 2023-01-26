import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchoolYearIDToWithdraw1674694229526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` ADD \`school_year_id\` int NULL AFTER \`StudentId\``);
    await queryRunner.query(`update withdrawal as w 
	                            left join mth_application as app on app.student_id = w.StudentId
	                            set w.school_year_id = app.school_year_id`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` DROP COLUMN \`school_year_id\``);
  }
}
