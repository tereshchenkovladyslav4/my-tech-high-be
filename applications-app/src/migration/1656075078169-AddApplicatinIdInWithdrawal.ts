import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicatinIdInWithdrawal1656075078169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` 
            ADD COLUMN \`application_id\` INT NULL AFTER \`withdrawal_id\`;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` DROP COLUMN \`application_id\``);
  }
}
