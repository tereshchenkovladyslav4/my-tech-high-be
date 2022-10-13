import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWithdrawalTable31652429609269 implements MigrationInterface {
  name = 'CreateWithdrawalTable31652429609269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`withdrawal\` (\`withdrawal_id\` int NOT NULL AUTO_INCREMENT, \`StudentId\` int NULL, \`status\` varchar(255) NULL, \`soe\` varchar(255) NULL, \`funding\` tinyint NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`date_effective\` datetime NULL, \`date_emailed\` datetime NULL, PRIMARY KEY (\`withdrawal_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` CHANGE \`student_id\` \`student_id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`withdrawal\` ADD CONSTRAINT \`FK_f1832392e1a6485b1efc1d06893\` FOREIGN KEY (\`StudentId\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`withdrawal\` DROP FOREIGN KEY \`FK_f1832392e1a6485b1efc1d06893\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` CHANGE \`student_id\` \`student_id\` int UNSIGNED NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`DROP TABLE \`withdrawal\``);
  }
}
