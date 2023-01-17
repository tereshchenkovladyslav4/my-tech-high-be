import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEnrollmentQuestionField1669302664645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` MODIFY \`question\` TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`mth_enrollment_questions\` MODIFY \`question\` VARCHAR(255)`);
  }
}
