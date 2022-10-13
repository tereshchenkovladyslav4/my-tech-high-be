import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldToEventTable1661908360328 implements MigrationInterface {
  name = 'AddFieldToEventTable1661908360328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` CHANGE \`time\` \`has_rsvp\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`has_rsvp\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`has_rsvp\` tinyint NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`has_rsvp\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`has_rsvp\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_event\` CHANGE \`has_rsvp\` \`time\` varchar(255) NULL`);
  }
}
