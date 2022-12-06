import { MigrationInterface, QueryRunner } from "typeorm";

export class createMasterAssignmentTable1670018622057 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `mth_assignments` (`id` INT(11) NOT NULL AUTO_INCREMENT,`master_id` INT(11) NOT NULL,`title` VARCHAR(255) NOT NULL, `due_date` datetime DEFAULT NULL,`reminder_date` DATETIME DEFAULT NULL,`auto_grade` DATETIME DEFAULT NULL,`auto_grade_email` INT(2) DEFAULT 0,PRIMARY KEY(`id`))")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE mth_assignments`);
    }
}
