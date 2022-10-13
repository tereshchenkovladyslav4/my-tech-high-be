import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudenthiddenResourceTable1660083477847 implements MigrationInterface {
  name = 'CreateStudenthiddenResourceTable1660083477847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_student_hidden_resource\` (\`student_id\` int NOT NULL, \`resource_id\` int NOT NULL, PRIMARY KEY (\`student_id\`, \`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_hidden_resource\` ADD CONSTRAINT \`FK_8b0083a6a6cb52efc4e80da048c\` FOREIGN KEY (\`student_id\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_hidden_resource\` ADD CONSTRAINT \`FK_53df6b7934ae33c4169ac4e404f\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_student_hidden_resource\` DROP FOREIGN KEY \`FK_53df6b7934ae33c4169ac4e404f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_student_hidden_resource\` DROP FOREIGN KEY \`FK_8b0083a6a6cb52efc4e80da048c\``,
    );
    await queryRunner.query(`DROP TABLE \`mth_student_hidden_resource\``);
  }
}
