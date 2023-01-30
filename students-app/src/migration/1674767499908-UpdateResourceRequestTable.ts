import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceRequestTable1674767499908 implements MigrationInterface {
  name = 'UpdateResourceRequestTable1674767499908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mth_resource_request\` CHANGE \`created_at\` \`created_at\` datetime(0) NOT NULL`,
    );
  }
}
