import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReimbursementSettingTable1669244562973 implements MigrationInterface {
  name = 'CreateReimbursementSettingTable1669244562973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_reimbursement_setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`school_year_id\` int NULL, \`information\` varchar(255) NULL, \`supplemental_reimbursements_forms\` int NULL, \`supplemental_direct_order_forms\` int NULL, \`technology_reimbursements_forms\` int NULL, \`technology_direct_order_forms\` int NULL, \`custom_reimbursements_forms\` int NULL, \`custom_direct_order_forms\` int NULL, \`is_merged_periods\` tinyint NULL, \`merged_periods\` varchar(255) NULL, \`merged_periods_reimbursements_forms\` int NULL, \`merged_periods_direct_order_forms\` int NULL, \`third_party_reimbursements_forms\` int NULL, \`require_software_reimbursements_forms\` int NULL, \`max_receipts\` int NULL, \`require_passing_grade\` tinyint NULL, \`min_grade_percentage\` int NULL, \`allow_delete\` tinyint NULL, \`allow_submit_with_updates_required\` tinyint NULL, \`auto_delete_updates_required\` tinyint NULL, \`num_days_delete_updates_required\` int NULL, \`display_remaining_funds\` tinyint NULL, \`remaining_funds\` text NULL, UNIQUE INDEX \`REL_aa43fe3f646653dfb3d1f9158b\` (\`school_year_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_setting\` ADD CONSTRAINT \`FK_aa43fe3f646653dfb3d1f9158b2\` FOREIGN KEY (\`school_year_id\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_reimbursement_setting\` DROP FOREIGN KEY \`FK_aa43fe3f646653dfb3d1f9158b2\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_aa43fe3f646653dfb3d1f9158b\` ON \`mth_reimbursement_setting\``);
    await queryRunner.query(`DROP TABLE \`mth_reimbursement_setting\``);
  }
}
