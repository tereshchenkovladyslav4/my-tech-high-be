import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriorityToProviderTable1673470601569 implements MigrationInterface {
  name = 'AddPriorityToProviderTable1673470601569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_provider\` ADD \`priority\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_provider\` DROP COLUMN \`priority\``);
  }
}
