import { MigrationInterface, QueryRunner } from "typeorm";

export class addSchoolYearIdEnrollmentQuestion1675115843990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_enrollment_question_group\` ADD \`school_year_id\` varchar(111) NULL AFTER \`id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_enrollment_question_group\` DROP COLUMN \`school_year_id\``);
    }

}
