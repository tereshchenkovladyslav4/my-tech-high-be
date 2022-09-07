import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentTable1662062821831 implements MigrationInterface {
  name = 'CreateAssessmentTable1662062821831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_assessment\` (\`assessment_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NOT NULL, \`test_name\` varchar(255) NOT NULL, \`grades\` varchar(255) NOT NULL, \`information\` text NOT NULL, \`priority\` int NULL, \`is_archived\` tinyint NOT NULL DEFAULT 1, \`option1\` varchar(255) NOT NULL, \`option_list\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`assessment_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_assessment\` ADD CONSTRAINT \`FK_938d576f2a5cc034d39a13361e5\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_assessment\` DROP FOREIGN KEY \`FK_938d576f2a5cc034d39a13361e5\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_assessment\``);
  }
}
