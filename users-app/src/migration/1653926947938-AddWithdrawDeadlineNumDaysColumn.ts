import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWithdrawDeadlineNumDaysColumn1653926947938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\`
        ADD COLUMN \`withdraw_deadline_num_days\` INT NOT NULL DEFAULT '1' AFTER \`enrollment_packet_deadline_num_days\`;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\`        
        DROP COLUMN \`withdraw_deadline_num_days\`;`);
  }
}
