import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneRecieveText1650391953377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_phone\` ADD COLUMN \`recieve_text\` TINYTEXT NULL DEFAULT NULL AFTER \`ext\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_phone\` DROP COLUMN \`recieve_text\``);
  }
}
