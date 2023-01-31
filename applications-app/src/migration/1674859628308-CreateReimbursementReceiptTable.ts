import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReimbursementReceiptTable1674859628308 implements MigrationInterface {
  name = 'CreateReimbursementReceiptTable1674859628308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_reimbursement_receipt\` (\`reimbursement_receipt_id\` int NOT NULL AUTO_INCREMENT, \`ReimbursementRequestId\` int NULL, \`file_id\` int NULL, \`file_name\` varchar(255) NULL, \`amount\` decimal(13,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`reimbursement_receipt_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_receipt\` ADD CONSTRAINT \`FK_1a77bda9273024e27349303496b\` FOREIGN KEY (\`ReimbursementRequestId\`) REFERENCES \`mth_reimbursement_request\`(\`reimbursement_request_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_receipt\` DROP FOREIGN KEY \`FK_1a77bda9273024e27349303496b\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_reimbursement_receipt\``);
  }
}
