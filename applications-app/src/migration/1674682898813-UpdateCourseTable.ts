import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCourseTable1674682898813 implements MigrationInterface {
  name = 'UpdateCourseTable1674682898813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_course\` ADD \`resource_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_course\` ADD CONSTRAINT \`FK_f762c8f7d98fb84b1b83d46bc91\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP FOREIGN KEY \`FK_f762c8f7d98fb84b1b83d46bc91\``);
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP COLUMN \`resource_id\``);
  }
}
