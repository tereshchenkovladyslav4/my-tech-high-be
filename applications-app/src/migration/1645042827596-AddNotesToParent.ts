import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotesToParent1645042827596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_parent\` ADD \`notes\` varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mth_parent', 'notes');
  }
}
