import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTitleTable1667410290777 implements MigrationInterface {
  name = 'UpdateTitleTable1667410290777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_title\` ADD \`priority\` int NULL`);
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`priority\` = (WITH \`UpdateData\` AS (SELECT \`title_id\`, \`subject_id\`, ROW_NUMBER() OVER(PARTITION BY \`subject_id\` ORDER BY \`title_id\`) AS \`RowNumber\` FROM \`mth_title\`) SELECT \`RowNumber\` FROM \`UpdateData\` WHERE \`mth_title\`.\`title_id\` = \`UpdateData\`.\`title_id\`) WHERE \`title_id\` > 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_title\` DROP COLUMN \`priority\``);
  }
}
