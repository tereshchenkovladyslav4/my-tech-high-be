import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFirstNameAndLastNameToNullableOfCoreUsersTable1652539253104
  implements MigrationInterface
{
  name = 'ChangeFirstNameAndLastNameToNullableOfCoreUsersTable1652539253104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`core_users\` CHANGE \`first_name\` \`first_name\` VARCHAR(255) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`core_users\` CHANGE \`last_name\` \`last_name\` VARCHAR(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`core_users\` CHANGE \`first_name\` \`first_name\` VARCHAR(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`core_users\` CHANGE \`last_name\` \`last_name\` VARCHAR(255) NOT NULL`,
    );
  }
}
