import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanCourseTitleTable1675223244863 implements MigrationInterface {
  name = 'CleanCourseTitleTable1675223244863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE \`mth_course_title\` FROM \`mth_course_title\`
      INNER JOIN \`mth_course\` ON \`mth_course_title\`.course_id = \`mth_course\`.id
      INNER JOIN \`mth_provider\` ON \`mth_provider\`.id = \`mth_course\`.provider_id
      INNER JOIN \`mth_title\` ON \`mth_course_title\`.title_id = \`mth_title\`.title_id
      INNER JOIN \`mth_subject\` ON \`mth_subject\`.subject_id = \`mth_title\`.subject_id
    WHERE \`mth_provider\`.school_year_id <> \`mth_subject\`.SchoolYearId`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT * FROM TABLE \`mth_course_title\``);
  }
}
