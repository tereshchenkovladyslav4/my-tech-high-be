import { MigrationInterface, QueryRunner } from "typeorm";

export class addTeacherDeadlineField1670266395906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_assignments\` ADD \`teacher_deadline\` datetime DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_assignments\` DROP COLUMN \`teacher_deadline\``);
    }

}
