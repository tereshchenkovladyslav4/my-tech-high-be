import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdditionalColumnsToEmailRecordTable1659550498000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_email_records\` ADD \`region_id\` INT(11) NOT NULL DEFAULT 1` );
        await queryRunner.query(`ALTER TABLE \`mth_email_records\` ADD \`bcc\` varchar(255) NOT NULL DEFAULT ''` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mth_email_records\` DROP COLUMN \`region_id\``);
        await queryRunner.query(`ALTER TABLE \`mth_email_records\` DROP COLUMN \`bcc\``);
    }

}
