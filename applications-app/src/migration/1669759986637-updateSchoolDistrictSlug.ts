import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSchoolDistrictSlug1669759986637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE mth_enrollment_questions SET slug="address_school_district" WHERE slug="packet_school_district"`,
        );
        await queryRunner.query(
            `UPDATE mth_application_question SET slug="address_school_district" WHERE slug="packet_school_district"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE mth_enrollment_questions SET slug="packet_school_district" WHERE slug="address_school_district"`,
        );
        await queryRunner.query(
            `UPDATE mth_application_question SET slug="packet_school_district" WHERE slug="address_school_district"`,
        );
    }

}
