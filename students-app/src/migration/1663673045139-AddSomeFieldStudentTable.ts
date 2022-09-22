import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldStudentTable1663673045139 implements MigrationInterface {
  name = 'AddSomeFieldStudentTable1663673045139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD \`opt_out_form_signature_name\` varchar(255) DEFAULT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`opt_out_form_signature_file_id\` int DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`opt_out_form_signature_file_id\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`opt_out_form_signature_name\``);
  }
}
