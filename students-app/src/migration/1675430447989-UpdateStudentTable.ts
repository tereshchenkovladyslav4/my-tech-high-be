import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentTable1675430447989 implements MigrationInterface {
  name = 'UpdateStudentTable1675430447989';

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
      LEFT JOIN \`mth_person\` ON \`mth_person\`.person_id = \`mth_student\`.person_id
      LEFT JOIN \`mth_parent\` ON \`mth_parent\`.parent_id = \`mth_student\`.parent_id
      LEFT JOIN \`mth_person\` \`parent_person\` ON \`parent_person\`.person_id = \`mth_parent\`.person_id
      SET \`mth_student\`.username_first = LOWER(\`mth_person\`.first_name), \`mth_student\`.username_last = LOWER(\`mth_person\`.last_name), \`mth_student\`.username_student_email = \`mth_person\`.email, \`mth_student\`.username_parent_email = \`parent_person\`.email
      WHERE \`mth_student\`.student_id > 0
    `);

    while (1) {
      const students = await queryRunner.query(
        `SELECT * FROM \`mth_student\`WHERE \`mth_student\`.username_first_last IS NULL LIMIT 1`,
      );
      if (!students?.length) break;
      const student = students[0];
      const studentId = student.student_id;
      const applications = await queryRunner.query(
        `SELECT * FROM \`mth_application\` WHERE \`mth_application\`.student_id = ${studentId} ORDER BY \`application_id\` LIMIT 1`,
      );
      let schoolYear;
      if (applications?.length) {
        const schoolYearId = applications[0].school_year_id;
        const schoolYears = await queryRunner.query(
          `SELECT * FROM \`mth_schoolyear\` WHERE \`mth_schoolyear\`.school_year_id = ${schoolYearId}`,
        );
        schoolYear = schoolYears[0];
      }
      const person = (
        await queryRunner.query(`SELECT * FROM \`mth_person\` WHERE \`mth_person\`.person_id = ${student.person_id}`)
      )?.[0];
      const username_first = student.username_first;
      const username_last = student.username_last;
      const year = new Date(schoolYear?.date_begin || new Date()).getFullYear().toString();
      const usernameBirthYear = new Date(person?.date_of_birth || new Date()).getFullYear().toString();

      let usernameAccount = 0;
      while (true) {
        const usernameAccountSuffix = usernameAccount ? `${usernameAccount}` : '';
        const username_first_last = `${username_first}${username_last}${usernameAccountSuffix}`;
        const username_last_first = `${username_last}${username_first}${usernameAccountSuffix}`;
        const username_last_first_year = `${username_last}${username_first}${usernameAccountSuffix}${year}`;
        const username_last_firstinitial = `${username_last}${username_first?.[0]}${usernameAccountSuffix}`;
        const username_last_first_mth = `${username_last}${username_first}${usernameAccountSuffix}mth`;
        const username_last_first_birth = `${username_last}${username_first}${usernameAccountSuffix}${usernameBirthYear}`;
        const username_first_last_domain = `${username_first}${username_last}${usernameAccountSuffix}@mytechhigh.com`;
        const duplicateStudents = await queryRunner.query(
          `SELECT * FROM \`mth_student\`WHERE \`mth_student\`.username_first_last = "${username_first_last}" OR \`mth_student\`.username_last_first = "${username_last_first}" OR \`mth_student\`.username_last_firstinitial = "${username_last_firstinitial}" AND student_id <> ${studentId}`,
        );
        usernameAccount += 1;
        if (duplicateStudents?.length) continue;
        await queryRunner.query(`UPDATE \`mth_student\`
            SET \`mth_student\`.username_first_last = "${username_first_last}", \`mth_student\`.username_last_first = "${username_last_first}", \`mth_student\`.username_last_first_year = "${username_last_first_year}", \`mth_student\`.username_last_firstinitial = "${username_last_firstinitial}", \`mth_student\`.username_last_first_mth = "${username_last_first_mth}", \`mth_student\`.username_last_first_birth ="${username_last_first_birth}", \`mth_student\`.username_first_last_domain = "${username_first_last_domain}"
            WHERE \`mth_student\`.student_id = ${studentId}`);
        break;
      }
    }
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
