import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTypeTable1654629457838 implements MigrationInterface {
  name = 'CreateEventTypeTable1654629457838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_event_type\` (\`event_type_id\` int NOT NULL AUTO_INCREMENT, \`RegionId\` int NULL, \`name\` varchar(255) NULL, \`color\` varchar(255) NULL, \`priority\` int NULL, \`archived\` tinyint NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`event_type_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_event_type\` ADD CONSTRAINT \`FK_c45c37557b025317705cc03fdc2\` FOREIGN KEY (\`RegionId\`) REFERENCES \`region\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_event_type\` DROP FOREIGN KEY \`FK_c45c37557b025317705cc03fdc2\``);
    await queryRunner.query(`DROP TABLE \`mth_event_type\``);
  }
}
