import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWithdrawalEmailTable1655073142137 implements MigrationInterface {
  name = 'CreateWithdrawalEmailTable1655073142137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_withdrawal_email\` (\`withdrawal_email_id\` int NOT NULL AUTO_INCREMENT, \`WithdrawalId\` int NULL, \`subject\` varchar(255) NOT NULL, \`body\` text NULL, \`from_email\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`withdrawal_email_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_withdrawal_email\` ADD CONSTRAINT \`FK_61ef9516d053afa8f9ff91d8619\` FOREIGN KEY (\`WithdrawalId\`) REFERENCES \`withdrawal\`(\`withdrawal_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_withdrawal_email\` DROP FOREIGN KEY \`FK_61ef9516d053afa8f9ff91d8619\``);
    await queryRunner.query(`DROP TABLE \`mth_withdrawal_email\``);
  }
}
