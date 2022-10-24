import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGradesForCourseAndTitle1666608287433 implements MigrationInterface {
  name = 'UpdateGradesForCourseAndTitle1666608287433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE \`mth_title\` SET \`min_grade\` = '-1' WHERE \`min_grade\` = 'Kindergarten'`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`min_grade\` \`min_grade\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`max_grade\` \`max_grade\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`min_alt_grade\` \`min_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`UPDATE \`mth_title\` SET \`min_alt_grade\` = NULL WHERE \`min_alt_grade\` = ''`);
    await queryRunner.query(
      `UPDATE \`mth_title\` SET \`min_alt_grade\` = '-1' WHERE \`min_alt_grade\` = 'Kindergarten'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`min_alt_grade\` \`min_alt_grade\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`max_alt_grade\` \`max_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`UPDATE \`mth_title\` SET \`max_alt_grade\` = NULL WHERE \`max_alt_grade\` = ''`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`max_alt_grade\` \`max_alt_grade\` int NULL`);

    await queryRunner.query(`UPDATE \`mth_course\` SET \`min_grade\` = '-1' WHERE \`min_grade\` = 'Kindergarten'`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`min_grade\` \`min_grade\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`max_grade\` \`max_grade\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`min_alt_grade\` \`min_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`UPDATE \`mth_course\` SET \`min_alt_grade\` = NULL WHERE \`min_alt_grade\` = ''`);
    await queryRunner.query(
      `UPDATE \`mth_course\` SET \`min_alt_grade\` = '-1' WHERE \`min_alt_grade\` = 'Kindergarten'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`min_alt_grade\` \`min_alt_grade\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`max_alt_grade\` \`max_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`UPDATE \`mth_course\` SET \`max_alt_grade\` = NULL WHERE \`max_alt_grade\` = ''`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`max_alt_grade\` \`max_alt_grade\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`min_grade\` \`min_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`max_grade\` \`max_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`min_alt_grade\` \`min_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_title\` CHANGE \`max_alt_grade\` \`max_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`min_grade\` \`min_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`max_grade\` \`max_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`min_alt_grade\` \`min_alt_grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_course\` CHANGE \`max_alt_grade\` \`max_alt_grade\` varchar(255) NULL`);
  }
}
