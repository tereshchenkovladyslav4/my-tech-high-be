import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateScheduleEmailTable1673996475190 implements MigrationInterface {
  name = 'UpdateScheduleEmailTable1673996475190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_email\` DROP FOREIGN KEY \`FK_d42e930cd8df811a5cca5e4a441\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` ADD CONSTRAINT \`FK_d42e930cd8df811a5cca5e4a441\` FOREIGN KEY (\`schedule_id\`) REFERENCES \`mth_schedule\`(\`schedule_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schedule_email\` DROP FOREIGN KEY \`FK_d42e930cd8df811a5cca5e4a441\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_email\` ADD CONSTRAINT \`FK_d42e930cd8df811a5cca5e4a441\` FOREIGN KEY (\`schedule_id\`) REFERENCES \`mth_schedule\`(\`schedule_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
