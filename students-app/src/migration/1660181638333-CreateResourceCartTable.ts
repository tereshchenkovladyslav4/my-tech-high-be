import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceCartTable1660181638333 implements MigrationInterface {
  name = 'CreateResourceCartTable1660181638333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mth_resource_cart\` (\`student_id\` int NOT NULL, \`resource_id\` int NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`student_id\`, \`resource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_cart\` ADD CONSTRAINT \`FK_ecf7bef7473e67bfee128946386\` FOREIGN KEY (\`student_id\`) REFERENCES \`mth_student\`(\`student_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_cart\` ADD CONSTRAINT \`FK_a34047a0c8d3bfceedd1c2f7595\` FOREIGN KEY (\`resource_id\`) REFERENCES \`mth_resource_settings\`(\`resource_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\` DROP FOREIGN KEY \`FK_a34047a0c8d3bfceedd1c2f7595\``);
    await queryRunner.query(`ALTER TABLE \`mth_resource_cart\` DROP FOREIGN KEY \`FK_ecf7bef7473e67bfee128946386\``);
    await queryRunner.query(`DROP TABLE \`mth_resource_cart\``);
  }
}
