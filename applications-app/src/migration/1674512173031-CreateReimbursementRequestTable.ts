import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReimbursementRequestTable1674512173031 implements MigrationInterface {
  name = 'CreateReimbursementRequestTable1674512173031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_reimbursement_request\` (\`reimbursement_request_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`StudentId\` int NULL, \`ParentId\` int NULL, \`is_direct_order\` tinyint NULL, \`form_type\` varchar(255) NULL, \`periods\` varchar(255) NULL, \`status\` varchar(255) NULL, \`total_amount\` decimal(13,2) NULL, \`signature_name\` varchar(255) NULL, \`signature_file_id\` int NULL, \`meta\` text NULL, \`date_submitted\` datetime NULL, \`date_paid\` datetime NULL, \`date_ordered\` datetime NULL, PRIMARY KEY (\`reimbursement_request_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request\` ADD CONSTRAINT \`FK_bb3bc52a4e0da41c23c6bd0ff0c\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request\` ADD CONSTRAINT \`FK_10cc5278924bf442cde4f008062\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request\` DROP FOREIGN KEY \`FK_10cc5278924bf442cde4f008062\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request\` DROP FOREIGN KEY \`FK_bb3bc52a4e0da41c23c6bd0ff0c\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_reimbursement_request\``);
  }
}
