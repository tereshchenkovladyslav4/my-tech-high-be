import { MigrationInterface, QueryRunner } from 'typeorm';

export class CountyAndShoolDistrictTableAdd1651100580163 implements MigrationInterface {
  name = 'CountyAndShoolDistrictTableAdd1651100580163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`county\` (\`id\` int NOT NULL AUTO_INCREMENT, \`county_name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`Region_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`school_district\` (\`id\` int NOT NULL AUTO_INCREMENT, \`school_district_name\` varchar(255) NOT NULL, \`school_district_code\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`Region_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`county\` ADD CONSTRAINT \`FK_68d68ff03d3c00621ccf95d7856\` FOREIGN KEY (\`Region_id\`) REFERENCES \`region\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`school_district\` ADD CONSTRAINT \`FK_089bfb8c371ae6a2d9fd07f00a8\` FOREIGN KEY (\`Region_id\`) REFERENCES \`region\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`school_district\` DROP FOREIGN KEY \`FK_089bfb8c371ae6a2d9fd07f00a8\``);
    await queryRunner.query(`ALTER TABLE \`county\` DROP FOREIGN KEY \`FK_68d68ff03d3c00621ccf95d7856\``);
    await queryRunner.query(`DROP TABLE \`school_district\``);
    await queryRunner.query(`DROP TABLE \`county\``);
  }
}
