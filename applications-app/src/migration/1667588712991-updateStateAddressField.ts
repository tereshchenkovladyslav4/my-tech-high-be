import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateStateAddressField1667588712991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` MODIFY COLUMN \`state\` varchar(50) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_address\` MODIFY COLUMN \`state\` varchar(2) NULL`);
  }
}
