import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInstructionMasterHoom1670659142734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE mth_master ADD instructions TEXT;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE mth_master DROP COLUMN  instructions;');
  }
}
