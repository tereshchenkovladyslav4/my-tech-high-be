import { MigrationInterface, QueryRunner } from 'typeorm';

export class addExtraEmailTemplateCategories1675974695347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`email_category\` (\`category_id\`, \`category_name\`) VALUES (8, 'Direct Orders');`,
    );
    await queryRunner.query(
      `INSERT INTO \`email_category\` (\`category_id\`, \`category_name\`) VALUES (9, 'Reimbursements');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
