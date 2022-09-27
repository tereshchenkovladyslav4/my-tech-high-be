import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDiplomaAnswerTable1663980212567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_diploma_answer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`school_year_id\` int NOT NULL, \`student_id\` int NOT NULL, \`answer\` int NOT NULL, \`grade\` varchar(255), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_diploma_answer\``);
  }
}
