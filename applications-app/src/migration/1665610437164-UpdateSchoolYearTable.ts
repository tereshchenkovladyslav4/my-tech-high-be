import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchoolYearTable1665610437164 implements MigrationInterface {
  name = 'UpdateSchoolYearTable1665610437164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`schedule\` \`schedule\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`diploma_seeking\` \`diploma_seeking\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`testing_preference\` \`testing_preference\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`testing_preference\` \`testing_preference\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_schoolyear\` CHANGE \`diploma_seeking\` \`diploma_seeking\` tinyint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`mth_schoolyear\` CHANGE \`schedule\` \`schedule\` tinyint NOT NULL`);
  }
}
