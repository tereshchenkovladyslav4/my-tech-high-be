import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateScheduleBuilder1663011199189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`mth_schedule_builder\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`max_num_periods\` INT NOT NULL,
            \`custom_built\` tinyint NOT NULL DEFAULT 0,
            \`third_party_provider\` tinyint NOT NULL DEFAULT 0,
            \`split_enrollment\` tinyint NOT NULL DEFAULT 0,
            \`always_unlock\` tinyint NOT NULL DEFAULT 0,
            \`parent_tooltip\` VARCHAR(100) NOT NULL DEFAULT '',
            \`school_year_id\` INT NOT NULL,
            PRIMARY KEY (\`id\`));`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`mth_schedule_builder\``);
    }

}
