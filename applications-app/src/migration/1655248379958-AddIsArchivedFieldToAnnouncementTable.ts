import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsArchivedFieldToAnnouncementTable1655248379958
  implements MigrationInterface
{
  name = 'AddIsArchivedFieldToAnnouncementTable1655248379958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`isArchived\` tinyint NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`isArchived\``,
    );
  }
}
