import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceRequestTable1674760935267 implements MigrationInterface {
  name = 'UpdateResourceRequestTable1674760935267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` ADD \`course_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` ADD CONSTRAINT \`FK_2b930fce83f3ab68a525333329e\` FOREIGN KEY (\`course_id\`) REFERENCES \`mth_course\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP FOREIGN KEY \`FK_2b930fce83f3ab68a525333329e\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP COLUMN \`course_id\``);
  }
}
