import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRegionId1649934594750 implements MigrationInterface {
  name = 'addRegionId1649934594750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` ADD \`RegionId\` int NULL`);

    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` ADD CONSTRAINT \`FK_afe4425166727024c39b94913a5\` FOREIGN KEY (\`RegionId\`) REFERENCES \`region\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP FOREIGN KEY \`FK_afe4425166727024c39b94913a5\``);

    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` DROP COLUMN \`RegionId\``);
  }
}
