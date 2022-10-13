import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeadlineNumDaysColumns1652806777786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\`
        ADD COLUMN \`application_deadline_num_days\` INT NOT NULL DEFAULT '1' AFTER \`grades\`,
        ADD COLUMN \`enrollment_packet_deadline_num_days\` INT NOT NULL DEFAULT '1' AFTER \`application_deadline_num_days\`;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\`
        DROP COLUMN \`application_deadline_num_days\`,
        DROP COLUMN \`enrollment_packet_deadline_num_days\`;`);
  }
}
