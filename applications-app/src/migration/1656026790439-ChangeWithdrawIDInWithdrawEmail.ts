import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeWithdrawIDInWithdrawEmail1656026790439 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_withdrawal_email\` CHANGE COLUMN \`WithdrawalId\` \`withdrawal_id\` INT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`mth_withdrawal_email\` CHANGE COLUMN \`withdrawal_id\` \`WithdrawalId\` INT NULL`,
        );
    }

}
