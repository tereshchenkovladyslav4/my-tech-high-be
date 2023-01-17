import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAutoIncreasePeriodId1668116226623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mth_provider_period DROP CONSTRAINT FK_59826e032f1ca7cde524d3e5f1b`);
    await queryRunner.query(`ALTER TABLE mth_subject_period DROP CONSTRAINT FK_61c110c1fa75c5fdbfd781c70c6`);
    await queryRunner.query(`ALTER TABLE mth_schedule_period DROP CONSTRAINT FK_66d44c8b8f82f92d6c360109e84`);
    await queryRunner.query(`ALTER TABLE mth_period MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(
      `ALTER TABLE mth_provider_period ADD FOREIGN KEY (\`period_id\`) REFERENCES mth_period(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE mth_subject_period ADD FOREIGN KEY (\`period_id\`) REFERENCES mth_period(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE mth_schedule_period ADD FOREIGN KEY (\`PeriodId\`) REFERENCES mth_period(\`id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE mth_provider_period ADD FOREIGN KEY (\`period_id\`) REFERENCES mth_period(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE mth_subject_period ADD FOREIGN KEY (\`period_id\`) REFERENCES mth_period(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE mth_schedule_period ADD FOREIGN KEY (\`PeriodId\`) REFERENCES mth_period(\`id\`)`,
    );
  }
}
