import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOrderToLearningLogQuestion1673286595731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE mth_learning_log_questions ADD `order` int(11) NOT NULL DEFAULT 1;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`order\``);
  }
}
