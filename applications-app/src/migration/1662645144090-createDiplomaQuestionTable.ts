import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDiplomaQuestionTable1662645144090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_diploma_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`school_year_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text, \`grades\` varchar(255), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_diploma_question\``);
  }
}
