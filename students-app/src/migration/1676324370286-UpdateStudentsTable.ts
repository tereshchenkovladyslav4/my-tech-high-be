import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentsTable1676324370286 implements MigrationInterface {
  name = 'UpdateStudentsTable1676324370286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student\` ADD CONSTRAINT \`FK_6ef207e9c038adf8a05e7195fea\` FOREIGN KEY (\`parent_id\`) REFERENCES \`mth_parent\`(\`parent_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_student\` DROP FOREIGN KEY \`FK_6ef207e9c038adf8a05e7195fea\``);
  }
}
