import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateNameToScheduleEmailTable1670264544677 implements MigrationInterface {
  name = 'AddTemplateNameToScheduleEmailTable1670264544677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_email\` ADD \`template_name\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` CHANGE \`created_at\` \`created_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schedule_email\` DROP COLUMN \`template_name\``);
  }
}
