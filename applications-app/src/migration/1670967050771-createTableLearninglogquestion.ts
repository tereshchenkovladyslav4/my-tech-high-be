import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableLearninglogquestion1670967050771 implements MigrationInterface {
  name = 'createTableLearninglogquestion1670967050771';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_learning_log_questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`master_id\` int NULL, \`type\` varchar(255) NOT NULL, \`question\` varchar(255) NOT NULL, \`options\` varchar(255) NOT NULL, \`default_question\` tinyint NOT NULL, \`custom_question\` tinyint NOT NULL, \`required\` tinyint NOT NULL, \`can_upload\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_learning_log_questions\``);
  }
}
