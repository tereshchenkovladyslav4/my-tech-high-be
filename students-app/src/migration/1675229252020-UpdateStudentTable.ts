import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentTable1675229252020 implements MigrationInterface {
  name = 'UpdateStudentTable1675229252020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_first\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_first_last\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_56d421910bc16e63108fde49da\` (\`username_first_last\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last_first\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_c338684d230460d52735cddc1f\` (\`username_last_first\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last_first_year\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_6bae4e0d889ad75a751ec90a8c\` (\`username_last_first_year\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last_firstinitial\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_0fc2469ee539279611ce274dda\` (\`username_last_firstinitial\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last_first_mth\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_8b8a618810c14c392f8e4fe7da\` (\`username_last_first_mth\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_last_first_birth\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_d226cd6c9157c575c351271af4\` (\`username_last_first_birth\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_first_last_domain\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD UNIQUE INDEX \`IDX_b2097fd9e6f061395bc674995c\` (\`username_first_last_domain\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_student_email\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_student\` ADD \`username_parent_email\` varchar(255) NULL`);

    await queryRunner.query(`
        UPDATE \`mth_student\`
            LEFT JOIN \`mth_person\`
        ON \`mth_person\`.person_id = \`mth_student\`.person_id
            LEFT JOIN (
            SELECT MAX (application_id) latest_application_id, student_id, school_year_id
            FROM \`mth_application\`
            GROUP BY student_id
            ) \`application_latest\` ON \`application_latest\`.student_id = \`mth_student\`.student_id
            LEFT JOIN \`mth_schoolyear\` ON \`application_latest\`.school_year_id = \`mth_schoolyear\`.school_year_id
            LEFT JOIN \`mth_parent\` ON \`mth_parent\`.parent_id = \`mth_student\`.parent_id
            LEFT JOIN \`mth_person\` \`parent_person\` ON \`parent_person\`.person_id = \`mth_parent\`.person_id
            SET
                \`mth_student\`.username_first = LOWER (\`mth_person\`.first_name), \`mth_student\`.username_last = LOWER (\`mth_person\`.last_name)
        WHERE \`mth_student\`.student_id > 0
    `);

    await queryRunner.query(`
                            UPDATE \`mth_student\`
                             SET \`username_parent_email\` =
                                     (WITH \`UpdateData\` AS
                                               (SELECT \`student_id\`,
                                                       CONCAT(\`username_last\`, SUBSTRING(\`username_first\`, 1, 1)) AS \`username\`,
                                                       ROW_NUMBER()                                                      OVER(PARTITION BY \`username\` ORDER BY \`student_id\`) AS \`RowNumber\`
                                                FROM \`mth_student\`)
                                      SELECT IF(\`RowNumber\` > 1, CONCAT('_', \`RowNumber\` - 1), '')
                                      FROM \`UpdateData\`
                                      WHERE \`mth_student\`.\`student_id\` = \`UpdateData\`.\`student_id\`)
                             WHERE \`student_id\` > 0
    `);

    await queryRunner.query(`
        UPDATE \`mth_student\`
            LEFT JOIN \`mth_person\`
        ON \`mth_person\`.person_id = \`mth_student\`.person_id
            LEFT JOIN (
            SELECT MAX (application_id) latest_application_id, student_id, school_year_id
            FROM \`mth_application\`
            GROUP BY student_id
            ) \`application_latest\` ON \`application_latest\`.student_id = \`mth_student\`.student_id
            LEFT JOIN \`mth_schoolyear\` ON \`application_latest\`.school_year_id = \`mth_schoolyear\`.school_year_id
            LEFT JOIN \`mth_parent\` ON \`mth_parent\`.parent_id = \`mth_student\`.parent_id
            LEFT JOIN \`mth_person\` \`parent_person\` ON \`parent_person\`.person_id = \`mth_parent\`.person_id
            SET
                \`mth_student\`.username_first_last = CONCAT(\`mth_student\`.username_first, \`mth_student\`.username_last, \`mth_student\`.username_parent_email), \`mth_student\`.username_last_first = CONCAT(\`mth_student\`.username_last, \`mth_student\`.username_first, \`mth_student\`.username_parent_email), \`mth_student\`.username_last_first_year = CONCAT(\`mth_student\`.username_last, \`mth_student\`.username_first, \`mth_student\`.username_parent_email, DATE_FORMAT(\`mth_schoolyear\`.date_begin, '%Y')), \`mth_student\`.username_last_firstinitial = CONCAT(\`mth_student\`.username_last, SUBSTRING (\`mth_student\`.username_first, 1, 1), \`mth_student\`.username_parent_email), \`mth_student\`.username_last_first_mth = CONCAT(\`mth_student\`.username_last, \`mth_student\`.username_first, \`mth_student\`.username_parent_email, 'mth'), \`mth_student\`.username_last_first_birth = CONCAT(\`mth_student\`.username_last, \`mth_student\`.username_first, \`mth_student\`.username_parent_email, DATE_FORMAT(\`mth_person\`.date_of_birth, '%Y')), \`mth_student\`.username_first_last_domain = CONCAT(\`mth_student\`.username_first, \`mth_student\`.username_last, \`mth_student\`.username_parent_email, '@mytechhigh.com'), \`mth_student\`.username_student_email = \`mth_person\`.email, \`mth_student\`.username_parent_email = \`parent_person\`.email
        WHERE \`mth_student\`.student_id > 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_parent_email\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_857514e3119659091ec78c4453\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_student_email\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_b2097fd9e6f061395bc674995c\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_first_last_domain\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_d226cd6c9157c575c351271af4\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last_first_birth\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_8b8a618810c14c392f8e4fe7da\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last_first_mth\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_0fc2469ee539279611ce274dda\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last_firstinitial\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_6bae4e0d889ad75a751ec90a8c\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last_first_year\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_c338684d230460d52735cddc1f\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last_first\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP INDEX \`IDX_56d421910bc16e63108fde49da\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_first_last\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_last\``);
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP COLUMN \`username_first\``);
  }
}
