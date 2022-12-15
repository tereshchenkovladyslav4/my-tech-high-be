import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTblStateCodes1671056076237 implements MigrationInterface {
  name = 'createTblStateCodes1671056076237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_state_codes\` (\`state_codes_id\` int NOT NULL AUTO_INCREMENT, \`TitleId\` int NULL, \`title_name\` varchar(255) NULL, \`state_code\` varchar(255) NULL, \`grade\` varchar(255) NULL, \`teacher\` varchar(255) NULL, \`subject\` varchar(255) NULL, PRIMARY KEY (\`state_codes_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` ADD CONSTRAINT \`FK_2f009fe2ab6e109b2bdc93d67da\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` DROP FOREIGN KEY \`FK_2f009fe2ab6e109b2bdc93d67da\``);
    await queryRunner.query(`DROP TABLE \`mth_state_codes\``);
  }
}
