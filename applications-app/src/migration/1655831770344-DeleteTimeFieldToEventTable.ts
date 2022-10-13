import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTimeFieldToEventTable1655831770344 implements MigrationInterface {
  name = 'DeleteTimeFieldToEventTable1655831770344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`time\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`created_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`updated_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event_type\` DROP COLUMN \`created_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event_type\` DROP COLUMN \`updated_date\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event_type\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event_type\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`start_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`start_date\` datetime NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`end_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`end_date\` datetime NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`end_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`end_date\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`start_date\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`start_date\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_event_type\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(`ALTER TABLE \`mth_event_type\` DROP COLUMN \`created_at\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(`ALTER TABLE \`mth_event\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_event_type\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event_type\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_event\` ADD \`time\` varchar(255) NULL`);
  }
}
