import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGradesForPeriod1668555767101 implements MigrationInterface {
  name = 'UpdateGradesForPeriod1668555767101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE \`mth_period\` SET \`grade_level_min\` = '-1' WHERE \`grade_level_min\` = 'Kindergarten'`,
    );
    await queryRunner.query(
      `UPDATE \`mth_period\` SET \`grade_level_max\` = '-1' WHERE \`grade_level_max\` = 'Kindergarten'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_period\` CHANGE \`grade_level_min\` \`min_grade\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_period\` CHANGE \`grade_level_max\` \`max_grade\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_period\` CHANGE \`min_grade\` \`grade_level_max\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_period\` CHANGE \`max_grade\` \`grade_level_min\` varchar(255) NULL`);
  }
}
