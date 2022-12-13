import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWithdrawToQuickLinksTable1670667956117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE infocenter.mth_quick_link set title = 'Withdraw' where title = 'Withdrawal'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE infocenter.mth_quick_link set title = 'Withdrawal' where title = 'Withdraw'`);
  }
}
