import { MigrationInterface, QueryRunner } from 'typeorm';

export class columnSizeIncreaseForFileTable1651538661770 implements MigrationInterface {
  name = 'columnSizeIncreaseForFileTable1651538661770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_file\` CHANGE \`item1\` \`item1\` varchar(1000) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_file\` CHANGE \`item1\` \`item1\` varchar(60) NOT NULL`);
  }
}
