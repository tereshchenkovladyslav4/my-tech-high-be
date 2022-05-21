import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeFieldsToAnnouncementTable1653064590572
  implements MigrationInterface
{
  name = 'AddSomeFieldsToAnnouncementTable1653064590572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`RegionId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`schedule_date\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`schedule_time\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`body\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD CONSTRAINT \`FK_480684abccae6be52d94e3e1aaf\` FOREIGN KEY (\`RegionId\`) REFERENCES \`region\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP FOREIGN KEY \`FK_480684abccae6be52d94e3e1aaf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`schedule_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`schedule_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`body\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`RegionId\``,
    );
  }
}
