import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePeriodPrice1669825510792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_period\` MODIFY \`price\` decimal(13,2)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_period\` MODIFY \`price\` INT`,
        );
    }

}
