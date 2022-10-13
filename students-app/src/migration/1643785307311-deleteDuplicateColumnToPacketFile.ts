import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleteDuplicateColumnToPacketFile1643785307311 implements MigrationInterface {
  name = 'deleteDuplicateColumnToPacketFile1643785307311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`item1\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`item2\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`year\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`type\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`name\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`item1\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`item2\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`year\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`type\``);
    await queryRunner.query(`ALTER TABLE \`mth_packet_file\` DROP COLUMN \`name\``);
  }
}
