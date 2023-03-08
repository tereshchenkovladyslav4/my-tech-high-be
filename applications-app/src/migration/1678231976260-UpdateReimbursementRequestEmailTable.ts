import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReimbursementRequestEmailTable1678231976260 implements MigrationInterface {
  name = 'UpdateReimbursementRequestEmailTable1678231976260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` DROP FOREIGN KEY \`FK_b99bd0e0e8f0413422bfb6e3c37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` DROP FOREIGN KEY \`FK_68e3c4c10e25c8ae89572501e3b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` ADD CONSTRAINT \`FK_b99bd0e0e8f0413422bfb6e3c37\` FOREIGN KEY (\`reimbursement_request_id\`) REFERENCES \`mth_reimbursement_request\`(\`reimbursement_request_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` ADD CONSTRAINT \`FK_68e3c4c10e25c8ae89572501e3b\` FOREIGN KEY (\`resource_request_id\`) REFERENCES \`mth_resource_request\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` DROP FOREIGN KEY \`FK_68e3c4c10e25c8ae89572501e3b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` DROP FOREIGN KEY \`FK_b99bd0e0e8f0413422bfb6e3c37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request_email\` ADD CONSTRAINT \`FK_68e3c4c10e25c8ae89572501e3b\` FOREIGN KEY (\`resource_request_id\`) REFERENCES \`mth_resource_request\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` ADD CONSTRAINT \`FK_b99bd0e0e8f0413422bfb6e3c37\` FOREIGN KEY (\`reimbursement_request_id\`) REFERENCES \`mth_reimbursement_request\`(\`reimbursement_request_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
