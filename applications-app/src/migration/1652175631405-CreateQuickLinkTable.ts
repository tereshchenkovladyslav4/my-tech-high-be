import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuickLinkTable1652175631405 implements MigrationInterface {
  name = 'CreateQuickLinkTable1652175631405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`mth_quick_link\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`region_id\` INT NOT NULL,
            \`title\` VARCHAR(45) NOT NULL,
            \`subtitle\` VARCHAR(45) NOT NULL DEFAULT '',
            \`image_url\` VARCHAR(100) NOT NULL DEFAULT '',
            \`type\` SMALLINT NOT NULL DEFAULT 0 COMMENT '0 => Withdrawal   1 => Website Link   2 => Form   3 => PDF to Sign',
            \`sequence\` INT NOT NULL,
            \`reserved\` TEXT NOT NULL COMMENT 'type = 1 => website link',
            \`flag\` SMALLINT NOT NULL DEFAULT 0 COMMENT '0 => Normal   1 => Archived    2 => Deleted',
            PRIMARY KEY (\`id\`));`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_quick_link\``);
  }
}
