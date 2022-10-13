import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeDeadline1658488480193 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` CHANGE \`deadline\` \`deadline\` DATETIME NULL DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_packet\` CHANGE \`deadline\` \`deadline\` DATE NULL DEFAULT NULL`);
  }
}
