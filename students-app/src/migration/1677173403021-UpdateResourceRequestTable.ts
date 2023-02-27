import { MigrationInterface, QueryRunner } from 'typeorm';
import { resourceUsername } from '../students/utils';

export class UpdateResourceRequestTable1677173403021 implements MigrationInterface {
  name = 'UpdateResourceRequestTable1677173403021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` ADD \`username\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` ADD \`password\` varchar(255) NOT NULL`);

    const resourceRequests = await queryRunner.query(`
        SELECT * FROM \`mth_resource_request\` 
        LEFT JOIN \`mth_student\` ON \`mth_student\`.student_id = \`mth_resource_request\`.student_id
        LEFT JOIN \`mth_resource_settings\` ON \`mth_resource_settings\`.resource_id = \`mth_resource_request\`.resource_id
      `);

    for (let index = 0; index <= resourceRequests.length - 1; index++) {
      const item = resourceRequests[index];
      const username = resourceUsername(item, item);
      const password = item.std_password;
      await queryRunner.query(`
        UPDATE \`mth_resource_request\`
        SET \`mth_resource_request\`.username = "${username}", \`mth_resource_request\`.password = "${password}"
        WHERE \`mth_resource_request\`.id = ${item.id}
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP COLUMN \`password\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_request\` DROP COLUMN \`username\``);
  }
}
