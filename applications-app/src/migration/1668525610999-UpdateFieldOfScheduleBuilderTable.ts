import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldOfScheduleBuilderTable1668525610999 implements MigrationInterface {
  name = 'UpdateFieldOfScheduleBuilderTable1668525610999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_builder\` CHANGE \`parent_tooltip\` \`parent_tooltip\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schedule_builder\` CHANGE \`parent_tooltip\` \`parent_tooltip\` varchar Not NULL`,
    );
  }
}
