import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSOETable1654620880289 implements MigrationInterface {
  name = 'CreateSOETable1654620880289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`school_partner\` (\`school_partner_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(255) NOT NULL, \`active\` int DEFAULT 1 NOT NULL,
    PRIMARY KEY (\`school_partner_id\`))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`school_partner\``);
  }
}
