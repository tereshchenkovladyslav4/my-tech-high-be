import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReimbursementQuestionTable1674063787036 implements MigrationInterface {
  name = 'CreateReimbursementQuestionTable1674063787036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_reimbursement_question\` (\`reimbursement_question_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`type\` int NULL, \`question\` text NULL, \`status\` varchar(255) NULL, \`options\` varchar(255) NULL, \`priority\` int NULL, \`required\` tinyint NULL, \`slug\` varchar(255) NULL, \`default_question\` tinyint NULL, \`reimbursement_form_type\` varchar(255) NULL, \`is_direct_order\` tinyint NULL, \`sortable\` tinyint NULL, \`display_for_admin\` tinyint NULL, \`additional_question\` varchar(255) NULL, PRIMARY KEY (\`reimbursement_question_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_question\` ADD CONSTRAINT \`FK_589f0f8f29adb55b2350a5c1f97\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_question\` DROP FOREIGN KEY \`FK_589f0f8f29adb55b2350a5c1f97\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_reimbursement_question\``);
  }
}
