import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateLogQuestionTable1671662018893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_learning_log_questions\``);

    await queryRunner.query(
      `CREATE TABLE \`mth_learning_log_questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`assignment_id\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`slug\` varchar(255) NULL,\`parent_slug\` varchar(255) NULL, \`question\` TEXT NOT NULL, \`options\` TEXT NULL, \`default_question\` tinyint NOT NULL, \`required\` tinyint NULL, \`can_upload\` tinyint NULL, \`grade_specific\` tinyint NULL, \`grades\` text null, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_learning_log_questions\``);
  }
}
