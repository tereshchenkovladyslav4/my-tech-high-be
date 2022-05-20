import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnnouncementTable1653000209479
  implements MigrationInterface
{
  name = 'CreateAnnouncementTable1653000209479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`announcement\` (\`announcement_id\` int NOT NULL AUTO_INCREMENT, \`UserId\` int NULL, \`status\` varchar(255) NULL, \`subject\` varchar(255) NULL, \`filter_grades\` varchar(255) NULL, \`filter_users\` varchar(255) NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`announcement_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD CONSTRAINT \`FK_e2a45c93c31327def8b03e47691\` FOREIGN KEY (\`UserId\`) REFERENCES \`core_users\`(\`user_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP FOREIGN KEY \`FK_e2a45c93c31327def8b03e47691\``,
    );
    await queryRunner.query(`DROP TABLE \`announcement\``);
  }
}
