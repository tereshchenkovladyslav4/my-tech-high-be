import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaColumnToPacketTable1651609162177
  implements MigrationInterface
{
  name = 'AddMetaColumnToPacketTable1651609162177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` ADD \`meta\` longtext`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` DROP COLUMN \`meta\``);
  }
}
