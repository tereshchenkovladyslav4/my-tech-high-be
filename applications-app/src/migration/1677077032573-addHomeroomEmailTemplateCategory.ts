import { MigrationInterface, QueryRunner } from 'typeorm';

export class addHomeroomEmailTemplateCategory1677077032573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE \`email_category\` SET \`category_id\` = 10 WHERE \`category_id\` = 9`);
    await queryRunner.query(`UPDATE \`email_category\` SET \`category_id\` = 9 WHERE \`category_id\` = 8`);
    await queryRunner.query(
      `INSERT INTO \`email_category\` (\`category_id\`, \`category_name\`) VALUES (8, 'Homeroom');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
