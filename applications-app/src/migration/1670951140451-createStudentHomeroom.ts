import { MigrationInterface, QueryRunner } from "typeorm";

export class createStudentHomeroom1670951140451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `mth_homeroom_student` ( `id` INT(11) NOT NULL AUTO_INCREMENT, `student_id` INT(11) NOT NULL, `school_year_id` INT(11) NOT NULL, `teacher_id` INT(11) NOT NULL, `auto_grade` VARCHAR(10), PRIMARY KEY (`id`) )")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE mth_homeroom_student;");
    }

}
