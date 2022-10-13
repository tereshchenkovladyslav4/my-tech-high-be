import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceTable1659126265811 implements MigrationInterface {
  name = 'CreateResourceTable1659126265811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_resource\` (\`resource_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`title\` varchar(255) NOT NULL, \`show_cost\` tinyint NOT NULL, \`cost\` int NULL, \`image\` varchar(255) NOT NULL, \`sequence\` int NULL, \`website\` varchar(100) NULL, \`hidden\` tinyint NOT NULL, \`allow_request\` tinyint NOT NULL, PRIMARY KEY (\`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`school_year_id\` \`school_year_id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource\` ADD CONSTRAINT \`FK_9bac4ea97bfc1bc39cc03750a94\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource\` DROP FOREIGN KEY \`FK_9bac4ea97bfc1bc39cc03750a94\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`school_year_id\` \`school_year_id\` int UNSIGNED NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`DROP TABLE \`mth_resource\``);
  }
}
