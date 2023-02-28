import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEmailTemplatesforHomeroom1677077209752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const regions = await queryRunner.query(`SELECT * FROM region`);
    const school_year_ids = [19, 13, 14, 15, 18, 20, 21, 28, 66];
    await queryRunner.query(`UPDATE \`email_templates\` SET \`category_id\` = 10 WHERE \`category_id\` = 9`);
    await queryRunner.query(`UPDATE \`email_templates\` SET \`category_id\` = 9 WHERE \`category_id\` = 8`);
    for (let i = 0; i < regions.length; i++) {
      const region = regions[i];
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Reminder', '', 'infocenter+applications@mytechhigh.com', '', '', 'Reminder', '', 'standard', 'parent,student,year,teacher', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Auto-grade', '', 'infocenter+applications@mytechhigh.com', '', '', 'Auto Grade', '', 'standard', 'parent,student,year,teacher', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Resubmit Required', '', 'infocenter+applications@mytechhigh.com', '', '', 'Resubmit Required', '', 'standard', 'parent,student,year,teacher,log,grade', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Graded Learning Log', '', 'infocenter+applications@mytechhigh.com', '', '', 'Graded Learning Log', '', 'standard', 'parent,student,year,teacher,log,grade', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
