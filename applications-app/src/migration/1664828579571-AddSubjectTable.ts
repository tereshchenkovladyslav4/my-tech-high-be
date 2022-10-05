import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubjectTable1664828579571 implements MigrationInterface {
  name = 'AddSubjectTable1664828579571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_subject_period\``);
    await queryRunner.query(`DROP TABLE \`mth_subject\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_title\` (\`title_id\` int NOT NULL AUTO_INCREMENT, \`subject_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`min_grade\` varchar(255) NOT NULL, \`max_grade\` varchar(255) NOT NULL, \`min_alt_grade\` varchar(255) NOT NULL, \`max_alt_grade\` varchar(255) NOT NULL, \`diploma_seeking_path\` varchar(255) NULL, \`reduce_funds\` varchar(255) NOT NULL, \`price\` decimal(13,2) NULL, \`reduce_funds_notification\` text NULL, \`custom_built_description\` text NULL, \`subject_notification\` text NULL, \`always_unlock\` tinyint NOT NULL DEFAULT 0, \`custom_built\` tinyint NOT NULL DEFAULT 0, \`third_party_provider\` tinyint NOT NULL DEFAULT 0, \`split_enrollment\` tinyint NOT NULL DEFAULT 0, \`software_reimbursement\` tinyint NOT NULL DEFAULT 0, \`display_notification\` tinyint NOT NULL DEFAULT 0, \`launchpad_course\` tinyint NOT NULL DEFAULT 0, \`course_id\` varchar(255) NULL, \`state_course_codes\` text NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`title_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_subject\` (\`subject_id\` int NOT NULL AUTO_INCREMENT, \`SchoolYearId\` int NULL, \`name\` varchar(255) NOT NULL, \`priority\` int NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`subject_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_subject_period\` (\`subject_id\` int NOT NULL, \`period_id\` int NOT NULL, PRIMARY KEY (\`subject_id\`, \`period_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_title\` ADD CONSTRAINT \`FK_7db8596356ddcd13462adf12771\` FOREIGN KEY (\`subject_id\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_subject\` ADD CONSTRAINT \`FK_86e1e7fce36d9a4d974c060ee8c\` FOREIGN KEY (\`SchoolYearId\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_subject_period\` ADD CONSTRAINT \`FK_f6ac8e87780ffda1a8c538fc0e7\` FOREIGN KEY (\`subject_id\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_subject_period\` ADD CONSTRAINT \`FK_61c110c1fa75c5fdbfd781c70c6\` FOREIGN KEY (\`period_id\`) REFERENCES \`mth_period\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_subject_period\` DROP FOREIGN KEY \`FK_61c110c1fa75c5fdbfd781c70c6\``);
    await queryRunner.query(`ALTER TABLE \`mth_subject_period\` DROP FOREIGN KEY \`FK_f6ac8e87780ffda1a8c538fc0e7\``);
    await queryRunner.query(`ALTER TABLE \`mth_subject\` DROP FOREIGN KEY \`FK_86e1e7fce36d9a4d974c060ee8c\``);
    await queryRunner.query(`ALTER TABLE \`mth_title\` DROP FOREIGN KEY \`FK_7db8596356ddcd13462adf12771\``);
    await queryRunner.query(`DROP TABLE \`mth_subject_period\``);
    await queryRunner.query(`DROP TABLE \`mth_subject\``);
    await queryRunner.query(`DROP TABLE \`mth_title\``);
  }
}
