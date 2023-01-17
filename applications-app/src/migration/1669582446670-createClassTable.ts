import { MigrationInterface, QueryRunner } from 'typeorm';

export class createClassTable1669582446670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_classes\` (\`class_id\` int NOT NULL AUTO_INCREMENT, \`master_id\` int(11) NOT NULL, \`class_name\` varchar(100) NOT NULL, \`primary_id\` int(11), \`addition_id\` TEXT,  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (\`class_id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_classes\``);
  }
}
