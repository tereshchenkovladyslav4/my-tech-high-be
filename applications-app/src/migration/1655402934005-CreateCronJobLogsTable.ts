import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCronJobLogsTable1655402934005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cron_jobs_logs\` ( \`log_id\` INT UNSIGNED NOT NULL AUTO_INCREMENT, \`function_name\` VARCHAR(255) NOT NULL, \`type\` VARCHAR(255) NOT NULL, \`log\` LONGTEXT NULL, \`created_at\` DATETIME(6) NOT NULL DEFAULT  CURRENT_TIMESTAMP(6), PRIMARY KEY (\`log_id\`) ) ENGINE=InnoDB;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`cron_jobs_logs\``);
  }
}
