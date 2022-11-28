import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChecklistTable1669297111634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_checklist\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_checklist\` (
       \`id\` int NOT NULL AUTO_INCREMENT, 
       \`school_year_id\` int(11) NOT NULL,
       \`region_id\` int(11) NOT NULL,
       \`checklist_id\` varchar(100) NOT NULL,
       \`status\` varchar(100)  NULL,
       \`subject\` varchar(100) NULL,
       \`grade\` int(11) NOT NULL,
       \`goal\` varchar(255)  NULL,
       \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_checklist\``);
  }
}
