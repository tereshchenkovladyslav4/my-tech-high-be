import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReimbursementRequestEmailTable1678216473158 implements MigrationInterface {
  name = 'CreateReimbursementRequestEmailTable1678216473158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_reimbursement_request_email\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reimbursement_request_id\` int NOT NULL, \`email_record_id\` int NOT NULL, \`subject\` varchar(255) NOT NULL, \`body\` text NULL, \`from_email\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_34e8cb90ec071b30df3b1729e7\` (\`email_record_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` ADD CONSTRAINT \`FK_b99bd0e0e8f0413422bfb6e3c37\` FOREIGN KEY (\`reimbursement_request_id\`) REFERENCES \`mth_reimbursement_request\`(\`reimbursement_request_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` ADD CONSTRAINT \`FK_34e8cb90ec071b30df3b1729e70\` FOREIGN KEY (\`email_record_id\`) REFERENCES \`mth_email_records\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` DROP FOREIGN KEY \`FK_34e8cb90ec071b30df3b1729e70\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_request_email\` DROP FOREIGN KEY \`FK_b99bd0e0e8f0413422bfb6e3c37\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_34e8cb90ec071b30df3b1729e7\` ON \`mth_reimbursement_request_email\``);
    await queryRunner.query(`DROP TABLE \`mth_reimbursement_request_email\``);
  }
}
