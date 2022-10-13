import { MigrationInterface, QueryRunner } from 'typeorm';

export class ColumnSizeIncreaseForGradeLevel1656011964403 implements MigrationInterface {
  name = 'ColumnSizeIncreaseForGradeLevel1656011964403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student_grade_level\` CHANGE \`grade_level\` \`grade_level\` varchar(20) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student_grade_level\` CHANGE \`grade_level\` \`grade_level\` varchar(3) NOT NULL`,
    );
  }
}
