import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmailTemplateTable1678227185346 implements MigrationInterface {
  name = 'UpdateEmailTemplateTable1678227185346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts=REPLACE(inserts, "type", "category") WHERE category_id=9 OR category_id=10`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE email_templates SET inserts=REPLACE(inserts, "category", "type") WHERE category_id=9 OR category_id=10`,
    );
  }
}
