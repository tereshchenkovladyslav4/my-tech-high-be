import { MigrationInterface, QueryRunner } from "typeorm";

export class removeSchedulePageEmailTemplate1669910017134 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM email_templates where template_name = "Schedules Page"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
