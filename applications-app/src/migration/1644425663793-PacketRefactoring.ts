import { MigrationInterface, QueryRunner } from 'typeorm';

export class PacketRefactoring1644425663793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` MODIFY \`race\` varchar(500)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` MODIFY \`race\` varchar(120)`);
  }
}
