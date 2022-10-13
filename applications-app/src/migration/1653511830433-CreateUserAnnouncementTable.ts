import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAnnouncementTable1653511830433 implements MigrationInterface {
  name = 'CreateUserAnnouncementTable1653511830433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_announcement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`AnnouncementId\` int NULL, \`user_id\` int NOT NULL, \`status\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_announcement\` ADD CONSTRAINT \`FK_2dbb76116f97204e63d83991efe\` FOREIGN KEY (\`AnnouncementId\`) REFERENCES \`announcement\`(\`announcement_id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_announcement\` DROP FOREIGN KEY \`FK_2dbb76116f97204e63d83991efe\``);
    await queryRunner.query(`DROP TABLE \`user_announcement\``);
  }
}
