import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionToSchoolPartners1656512315345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`school_partner\` ADD COLUMN \`region_id\` INT, ADD CONSTRAINT \`FK_school_partner_region\` FOREIGN KEY (\`region_id\`) REFERENCES \`region\` (\`id\`) ON UPDATE RESTRICT ON DELETE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('school_partner', 'region_id');
  }
}
