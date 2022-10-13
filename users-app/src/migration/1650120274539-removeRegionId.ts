import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeRegionId1650120274539 implements MigrationInterface {
  name = 'removeRegionId1650120274539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` DROP FOREIGN KEY \`FK_54bf2818af7cc627f2f81f091a6\``);
    await queryRunner.query(`ALTER TABLE \`region\` DROP COLUMN \`region_id\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`region\` ADD \`region_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`region\` ADD CONSTRAINT \`FK_54bf2818af7cc627f2f81f091a6\` FOREIGN KEY (\`region_id\`) REFERENCES \`user_region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
