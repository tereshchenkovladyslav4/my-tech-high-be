import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentLearningLogTable1676310860014 implements MigrationInterface {
  name = 'CreateStudentLearningLogTable1676310860014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_student_learning_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`StudentId\` int NULL, \`AssignmentId\` int NULL, \`status\` varchar(255) NULL, \`meta\` text NULL, \`grade\` decimal(13,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` ADD CONSTRAINT \`FK_4b12547deaabc6df4e6308d8028\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` ADD CONSTRAINT \`FK_82b5c6b5d501bd4e6deb3eacf1d\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` ADD CONSTRAINT \`FK_81df4128800d373eb7629e94b8a\` FOREIGN KEY (\`AssignmentId\`) REFERENCES \`mth_assignments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` DROP FOREIGN KEY \`FK_81df4128800d373eb7629e94b8a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` DROP FOREIGN KEY \`FK_82b5c6b5d501bd4e6deb3eacf1d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_learning_log\` DROP FOREIGN KEY \`FK_4b12547deaabc6df4e6308d8028\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_student_learning_log\``);
  }
}
