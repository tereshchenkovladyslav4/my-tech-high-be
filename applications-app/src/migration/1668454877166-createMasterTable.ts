import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMasterTable1668454877166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_master\` (\`master_id\` int NOT NULL AUTO_INCREMENT, \`school_year_id\` int(11) NOT NULL, \`master_name\` varchar(100) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (\`master_id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_master\``);
  }
}
