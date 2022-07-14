import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldApplicationQuestionTable1657580080434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_application_question\` ADD \`main_question\` tinyint NOT NULL DEFAULT 0`,
          );
          await queryRunner.query(
            `ALTER TABLE \`mth_application_question\` ADD \`additional_question\` varchar(255) NULL`,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_application_question\` DROP \`main_question\``,
          );
        await queryRunner.query(
        `ALTER TABLE \`mth_application_question\` DROP \`additional_question\``,
        );
    }

}
