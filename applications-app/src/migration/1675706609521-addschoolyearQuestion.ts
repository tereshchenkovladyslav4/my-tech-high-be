import { MigrationInterface, QueryRunner } from 'typeorm';

export class addschoolyearQuestion1675706609521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_question\` ADD \`school_year_id\` int NULL AFTER \`id\`, ADD \`mid_year\` tinyint DEFAULT 0 AFTER \`school_year_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mth_question DROP COLUMN school_year_id, DROP COLUMN mid_year`);
  }
}
