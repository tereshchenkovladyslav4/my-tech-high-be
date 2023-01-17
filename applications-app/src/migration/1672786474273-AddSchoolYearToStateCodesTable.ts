import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchoolYearToStateCodesTable1672786474273 implements MigrationInterface {
  name = 'AddSchoolYearToStateCodesTable1672786474273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` ADD \`SchoolYearId\` int NULL`);

    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` DROP FOREIGN KEY \`FK_2f009fe2ab6e109b2bdc93d67da\``);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`TitleId\` \`TitleId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`title_name\` \`title_name\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`state_code\` \`state_code\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`grade\` \`grade\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`teacher\` \`teacher\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`subject\` \`subject\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` ADD CONSTRAINT \`FK_2f009fe2ab6e109b2bdc93d67da\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` ADD CONSTRAINT \`FK_a0a56f6a9a1c5d69d6bacf9d9ed\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` DROP FOREIGN KEY \`FK_a0a56f6a9a1c5d69d6bacf9d9ed\``);
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` DROP FOREIGN KEY \`FK_2f009fe2ab6e109b2bdc93d67da\``);

    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` CHANGE \`subject\` \`subject\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` CHANGE \`teacher\` \`teacher\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` CHANGE \`grade\` \`grade\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` CHANGE \`state_code\` \`state_code\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` CHANGE \`title_name\` \`title_name\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` CHANGE \`TitleId\` \`TitleId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`mth_state_codes\` ADD CONSTRAINT \`FK_2f009fe2ab6e109b2bdc93d67da\` FOREIGN KEY (\`TitleId\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_state_codes\` DROP COLUMN \`SchoolYearId\``);
  }
}
