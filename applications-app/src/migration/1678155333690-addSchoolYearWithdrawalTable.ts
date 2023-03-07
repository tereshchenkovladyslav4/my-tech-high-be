import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSchoolYearWithdrawalTable1678155333690 implements MigrationInterface {
  name = 'addSchoolYearWithdrawalTable1678155333690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` CHANGE \`school_year_id\` \`school_year_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`withdrawal\` ADD CONSTRAINT \`FK_ba513785b4bbc4120bda6385cf1\` FOREIGN KEY (\`school_year_id\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`withdrawal\` CHANGE \`school_year_id\` \`school_year_id\` int NULL DEFAULT 'NULL'`,
    );
  }
}
