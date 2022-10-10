import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderAndCourseTable1665034062519 implements MigrationInterface {
  name = 'AddProviderAndCourseTable1665034062519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mth_provider\``);
    await queryRunner.query(`DROP TABLE \`mth_course\``);
    await queryRunner.query(
      `CREATE TABLE \`mth_provider\` (\`id\` int NOT NULL AUTO_INCREMENT, \`school_year_id\` int NULL, \`name\` varchar(255) NOT NULL, \`is_display\` tinyint NOT NULL, \`reduce_funds\` varchar(255) NOT NULL, \`price\` decimal(13,2) NULL, \`reduce_funds_notification\` text NULL, \`multiple_periods\` tinyint NOT NULL, \`multi_periods_notification\` text NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`provider_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`min_grade\` varchar(255) NOT NULL, \`max_grade\` varchar(255) NOT NULL, \`min_alt_grade\` varchar(255) NOT NULL, \`max_alt_grade\` varchar(255) NOT NULL, \`always_unlock\` tinyint NOT NULL DEFAULT 0, \`software_reimbursement\` tinyint NOT NULL DEFAULT 0, \`display_notification\` tinyint NOT NULL DEFAULT 0, \`course_notification\` text NULL, \`launchpad_course\` tinyint NOT NULL DEFAULT 0, \`course_id\` varchar(255) NULL, \`website\` varchar(255) NOT NULL, \`diploma_seeking_path\` varchar(255) NULL, \`limit\` int NULL, \`reduce_funds\` varchar(255) NOT NULL, \`price\` decimal(13,2) NULL, \`reduce_funds_notification\` text NULL, \`subject_id\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_provider_period\` (\`provider_id\` int NOT NULL, \`period_id\` int NOT NULL, INDEX \`IDX_714d3ec137afeba9647df45af9\` (\`provider_id\`), INDEX \`IDX_59826e032f1ca7cde524d3e5f1\` (\`period_id\`), PRIMARY KEY (\`provider_id\`, \`period_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mth_course_title\` (\`course_id\` int NOT NULL, \`title_id\` int NOT NULL, INDEX \`IDX_8bae82ed830e089100bca4d1a5\` (\`course_id\`), INDEX \`IDX_cd416fce02f9024198559a57ab\` (\`title_id\`), PRIMARY KEY (\`course_id\`, \`title_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f6ac8e87780ffda1a8c538fc0e\` ON \`mth_subject_period\` (\`subject_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_provider\` ADD CONSTRAINT \`FK_e6739c1a07f289747948e7fcef5\` FOREIGN KEY (\`school_year_id\`) REFERENCES \`mth_schoolyear\`(\`school_year_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_course\` ADD CONSTRAINT \`FK_1fdd6156ec1da1a16197c089588\` FOREIGN KEY (\`provider_id\`) REFERENCES \`mth_provider\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_course\` ADD CONSTRAINT \`FK_aded6d37bda253e05732cce5d1f\` FOREIGN KEY (\`subject_id\`) REFERENCES \`mth_subject\`(\`subject_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_provider_period\` ADD CONSTRAINT \`FK_714d3ec137afeba9647df45af9b\` FOREIGN KEY (\`provider_id\`) REFERENCES \`mth_provider\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_provider_period\` ADD CONSTRAINT \`FK_59826e032f1ca7cde524d3e5f1b\` FOREIGN KEY (\`period_id\`) REFERENCES \`mth_period\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_course_title\` ADD CONSTRAINT \`FK_8bae82ed830e089100bca4d1a52\` FOREIGN KEY (\`course_id\`) REFERENCES \`mth_course\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_course_title\` ADD CONSTRAINT \`FK_cd416fce02f9024198559a57ab3\` FOREIGN KEY (\`title_id\`) REFERENCES \`mth_title\`(\`title_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_course_title\` DROP FOREIGN KEY \`FK_cd416fce02f9024198559a57ab3\``);
    await queryRunner.query(`ALTER TABLE \`mth_course_title\` DROP FOREIGN KEY \`FK_8bae82ed830e089100bca4d1a52\``);
    await queryRunner.query(`ALTER TABLE \`mth_provider_period\` DROP FOREIGN KEY \`FK_59826e032f1ca7cde524d3e5f1b\``);
    await queryRunner.query(`ALTER TABLE \`mth_provider_period\` DROP FOREIGN KEY \`FK_714d3ec137afeba9647df45af9b\``);
    await queryRunner.query(`ALTER TABLE \`mth_subject_period\` DROP FOREIGN KEY \`FK_61c110c1fa75c5fdbfd781c70c6\``);
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP FOREIGN KEY \`FK_aded6d37bda253e05732cce5d1f\``);
    await queryRunner.query(`ALTER TABLE \`mth_course\` DROP FOREIGN KEY \`FK_1fdd6156ec1da1a16197c089588\``);
    await queryRunner.query(`ALTER TABLE \`mth_provider\` DROP FOREIGN KEY \`FK_e6739c1a07f289747948e7fcef5\``);
    await queryRunner.query(`DROP INDEX \`IDX_f6ac8e87780ffda1a8c538fc0e\` ON \`mth_subject_period\``);
    await queryRunner.query(`DROP INDEX \`IDX_cd416fce02f9024198559a57ab\` ON \`mth_course_title\``);
    await queryRunner.query(`DROP INDEX \`IDX_8bae82ed830e089100bca4d1a5\` ON \`mth_course_title\``);
    await queryRunner.query(`DROP TABLE \`mth_course_title\``);
    await queryRunner.query(`DROP INDEX \`IDX_59826e032f1ca7cde524d3e5f1\` ON \`mth_provider_period\``);
    await queryRunner.query(`DROP INDEX \`IDX_714d3ec137afeba9647df45af9\` ON \`mth_provider_period\``);
    await queryRunner.query(`DROP TABLE \`mth_provider_period\``);
    await queryRunner.query(`DROP TABLE \`mth_course\``);
    await queryRunner.query(`DROP TABLE \`mth_provider\``);
  }
}
