import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchoolDistrictOfAddress1672239613558 implements MigrationInterface {
  name = 'UpdateSchoolDistrictOfAddress1672239613558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE \`mth_address\`
                             SET \`school_district\` = (WITH \`UpdateData\` AS (SELECT \`mth_packet\`.\`student_id\` AS \`student_id\`,
                                                                                       \`school_district\`           AS \`SchoolDistrict\`,
                                                                                       \`address_id\`
                                                                                FROM \`mth_packet\`
                                                                                         LEFT JOIN \`mth_student\` \`ms\` on \`mth_packet\`.\`student_id\` = \`ms\`.\`student_id\`
                                                                                         LEFT JOIN \`mth_person\` \`mp\` on \`ms\`.\`person_id\` = \`mp\`.\`person_id\`
                                                                                         LEFT JOIN \`mth_person_address\` \`mpa\` on \`mp\`.\`person_id\` = \`mpa\`.\`person_id\`)
                                                        SELECT \`SchoolDistrict\`
                                                        FROM \`UpdateData\`
                                                        WHERE \`mth_address\`.\`address_id\` = \`UpdateData\`.\`address_id\`)
                             WHERE (\`mth_address\`.\`school_district\` IS NULL OR \`mth_address\`.\`school_district\` = '')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT * FROM \`mth_address\``);
  }
}
