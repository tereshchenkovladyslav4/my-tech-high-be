import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentOptionTableAndStudentAssessmentTable1663618640402 implements MigrationInterface {
  name = 'CreateAssessmentOptionTableAndStudentAssessmentTable1663618640402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_student_assessment_option\` (\`assessment_option_id\` int NOT NULL AUTO_INCREMENT, \`StudentId\` int NOT NULL, \`AssessmentId\` int NOT NULL, \`OptionId\` int NOT NULL, \`out_text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`assessment_option_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_assessment_option\` (\`option_id\` int NOT NULL AUTO_INCREMENT, \`AssessmentId\` int NOT NULL, \`label\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, \`require_reason\` tinyint NOT NULL DEFAULT 1, \`reason\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`option_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` DROP COLUMN \`option1\``);
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` DROP COLUMN \`option_list\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_6d0127824ab72727f908cc8b40f\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` ADD CONSTRAINT \`FK_9286cf7c79dc5e0cd508cbcf964\` FOREIGN KEY (\`OptionId\`) REFERENCES \`mth_assessment_option\`(\`option_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` ADD CONSTRAINT \`FK_d8544945d9626b644f385920a72\` FOREIGN KEY (\`AssessmentId\`) REFERENCES \`mth_assessment\`(\`assessment_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_assessment_option\` DROP FOREIGN KEY \`FK_d8544945d9626b644f385920a72\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_9286cf7c79dc5e0cd508cbcf964\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_assessment_option\` DROP FOREIGN KEY \`FK_6d0127824ab72727f908cc8b40f\``,
    );
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` ADD \`option_list\` text NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_assessment\` ADD \`option1\` varchar(255) NOT NULL`);
    await queryRunner.query(`DROP TABLE \`mth_assessment_option\``);
    await queryRunner.query(`DROP TABLE \`mth_student_assessment_option\``);
  }
}
