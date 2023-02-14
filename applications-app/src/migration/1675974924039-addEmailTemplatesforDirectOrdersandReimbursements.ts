import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEmailTemplatesforDirectOrdersandReimbursements1675974924039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const regions = await queryRunner.query(`SELECT * FROM region`);
    const school_year_ids = [19, 13, 14, 15, 18, 20, 21, 28, 66];
    regions.map(async (region) => {
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Updates Required', '', 'infocenter+applications@mytechhigh.com', '', '', 'Direct Order Updates Required', '', 'standard_modal', 'parent,student,submitted,amount,type,period,link,instructions', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );

      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Approved', '', 'infocenter+applications@mytechhigh.com', '', '', 'Direct Order Approved', '', 'standard', 'parent,student,submitted,amount,type,period,link', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );

      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (8, 'Ordered', '', 'infocenter+applications@mytechhigh.com', '', '', 'Direct Order Ordered', '', 'standard', 'parent,student,submitted,amount,type,period,link', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
    });

    regions.map(async (region) => {
      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (9, 'Updates Required', '', 'infocenter+applications@mytechhigh.com', '', '', 'Reimbursement Updates Required', '', 'standard_modal', 'parent,student,submitted,amount,type,period,link,instructions', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );

      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (9, 'Approved', '', 'infocenter+applications@mytechhigh.com', '', '', 'Reimbursement Approved', '', 'standard', 'parent,student,submitted,amount,type,period,link', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );

      await queryRunner.query(
        `INSERT INTO \`email_templates\` (\`category_id\`, \`title\`, \`subject\`, \`from\`, \`bcc\`, \`body\`, \`template_name\`, \`standard_responses\`, \`template\`, \`inserts\`, \`priority\`, \`region_id\`, \`school_year_id\`) VALUES (9, 'Paid', '', 'infocenter+applications@mytechhigh.com', '', '', 'Reimbursement Paid', '', 'standard', 'parent,student,submitted,amount,type,period,confirmation,link', 0, ` +
          region.id +
          ', ' +
          school_year_ids[region.id - 1] +
          `);`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
