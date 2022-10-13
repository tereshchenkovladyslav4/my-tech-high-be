import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMthSchoolEnrollmenTable1659782590779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_school_enrollment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`student_id\` int(11) NOT NULL, \`school_year_id\` int NOT NULL, \`school_partner_id\` int NOT NULL,
            PRIMARY KEY (\`id\`))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_school_enrollment\``);
  }
}
