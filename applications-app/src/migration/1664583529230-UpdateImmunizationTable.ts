import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImmunizationTable1664583529230 implements MigrationInterface {
  name = 'UpdateImmunizationTable1664583529230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_immunization_settings\` ADD \`region_id\` int NOT NULL`);
    await queryRunner.query(`UPDATE TABLE \`mth_immunization_settings\` SET \`region_id\`='1'`);
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` ADD CONSTRAINT \`FK_e125d7318afb4b8b00e76b18409\` FOREIGN KEY (\`region_id\`) REFERENCES \`region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_immunization_settings\` DROP FOREIGN KEY \`FK_e125d7318afb4b8b00e76b18409\``,
    );
    await queryRunner.query(`ALTER TABLE \`mth_immunization_settings\` DROP COLUMN \`region_id\``);
  }
}
