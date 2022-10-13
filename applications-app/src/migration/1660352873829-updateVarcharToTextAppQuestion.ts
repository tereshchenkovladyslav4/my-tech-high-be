import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVarcharToTextAppQuestion1660352873829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` MODIFY \`question\` TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_application_question\` MODIFY \`question\` VARCHAR(255)`);
  }
}
