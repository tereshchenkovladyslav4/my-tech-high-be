import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteSubjectIdFieldToCourseTable1673292524324 implements MigrationInterface {
  name = 'DeleteSubjectIdFieldToCourseTable1673292524324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP FOREIGN KEY \`FK_aded6d37bda253e05732cce5d1f\``);
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP COLUMN \`subject_id\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_course\` ADD \`subject_id\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_course\` ADD CONSTRAINT \`FK_aded6d37bda253e05732cce5d1f\` FOREIGN KEY (\`subject_id\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
