import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponseColumnToWithdrawalTable1655741431873 implements MigrationInterface {
  name = 'AddResponseColumnToWithdrawalTable1655741431873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` 
            ADD COLUMN \`response\` TEXT NULL AFTER \`date_emailed\`;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` DROP COLUMN \`response\``);
  }
}
