import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetForeignKeyToSomeTables1676050363211 implements MigrationInterface {
  name = 'SetForeignKeyToSomeTables1676050363211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_homeroom_student\` RENAME COLUMN teacher_id TO class_id`);
    await queryRunner.query(
      `ALTER TABLE \`mth_homeroom_student\` ADD CONSTRAINT \`FK_af8458dea8b19e8d37b3362454c\` FOREIGN KEY (\`class_id\`) REFERENCES \`mth_classes\`(\`class_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_classes\` ADD CONSTRAINT \`FK_222220ae7f2025fcc0151ab62c4\` FOREIGN KEY (\`master_id\`) REFERENCES \`mth_master\`(\`master_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_classes\` ADD CONSTRAINT \`FK_58ee56bb4d214f00807130030c2\` FOREIGN KEY (\`primary_id\`) REFERENCES \`core_users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`TRUNCATE TABLE \`mth_assignments\``);
    await queryRunner.query(
      `ALTER TABLE \`mth_assignments\` ADD CONSTRAINT \`FK_570a18338a72abe762b16e13a47\` FOREIGN KEY (\`master_id\`) REFERENCES \`mth_master\`(\`master_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_homeroom_student\` DROP FOREIGN KEY \`FK_af8458dea8b19e8d37b3362454c\``);
    await queryRunner.query(`ALTER TABLE \`mth_homeroom_student\` RENAME COLUMN class_id TO teacher_id`);
    await queryRunner.query(`ALTER TABLE \`mth_classes\` DROP FOREIGN KEY \`FK_58ee56bb4d214f00807130030c2\``);
    await queryRunner.query(`ALTER TABLE \`mth_classes\` DROP FOREIGN KEY \`FK_222220ae7f2025fcc0151ab62c4\``);
    await queryRunner.query(`ALTER TABLE \`mth_assignments\` DROP FOREIGN KEY \`FK_570a18338a72abe762b16e13a47\``);
  }
}
