import { MigrationInterface, QueryRunner } from 'typeorm';
export class updateLearnigQuestionValidation1673970940706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`required\``);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`can_upload\``);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`grade_specific\``);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` ADD \`validations\` varchar(255)`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` ADD \`required\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` ADD \`can_upload\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` ADD \`grade_specific\` tinyint NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`mth_learning_log_questions\` DROP COLUMN \`validations\``);
  }
}
