import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAdditionalQuestionFieldInQuestionTable1653399382203 implements MigrationInterface {
  name = 'ChangeAdditionalQuestionFieldInQuestionTable1653399382203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_question\` CHANGE COLUMN \`additional_question\` \`additional_question\` varchar(255) NOT NULL DEFAULT '' COMMENT 'The slug of parent question for Additional Question'`,
    );
    await queryRunner.query(`UPDATE \`mth_question\` SET \`additional_question\` = '' WHERE \`id\` > 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_question\` CHANGE COLUMN \`additional_question\` \`additional_question\` TINYINT(2) NOT NULL DEFAULT 0 COMMENT 'The slug of parent question for Additional Question'`,
    );
    await queryRunner.query(`UPDATE \`mth_question\` SET \`additional_question\` = 0 WHERE \`id\` > 0`);
  }
}
