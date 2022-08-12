import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { Resource } from '../models/resource.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    private studentGradeLevelService: StudentGradeLevelsService,
  ) {}

  async find(studentId: number): Promise<Resource[]> {
    const studentGradeLevel =
      await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }

    const { school_year_id: schoolYearId } = studentGradeLevel;

    const queryRunner = await getConnection().createQueryRunner();
    const data: Resource[] = await queryRunner.query(`
      SELECT 
        resource.*,
        COUNT(student_hidden_resource.student_id) AS HiddenByStudent
      FROM 
        infocenter.mth_resource_settings AS resource
      LEFT JOIN 
        infocenter.mth_student_hidden_resource student_hidden_resource 
      ON (
        resource.resource_id = student_hidden_resource.resource_id AND
        student_hidden_resource.student_id = ${studentId}
      )
      WHERE
        SchoolYearId = ${schoolYearId} AND is_active = 1
      GROUP BY 
        resource.resource_id
      ORDER BY
        HiddenByStudent ASC, resource.priority ASC;
    `);
    data.map((item) => (item.HiddenByStudent = !!Number(item.HiddenByStudent)));
    queryRunner.release();
    return data;
  }

  async save(
    toggleHiddenResourceInput: ToggleHiddenResourceInput,
  ): Promise<Boolean> {
    try {
      const { student_id, resource_id, hidden } = toggleHiddenResourceInput;
      const queryRunner = await getConnection().createQueryRunner();
      const existing = await queryRunner.query(`
        SElECT * FROM infocenter.mth_student_hidden_resource
        WHERE student_id = ${student_id} AND resource_id = ${resource_id};
      `);
      if (hidden) {
        if (!existing.length) {
          await queryRunner.query(`
            INSERT INTO infocenter.mth_student_hidden_resource
              (student_id, resource_id)
            VALUES
              (${student_id}, ${resource_id});
          `);
        }
      } else {
        if (!!existing.length) {
          await queryRunner.query(`
          DELETE FROM infocenter.mth_student_hidden_resource
          WHERE student_id = ${student_id} AND resource_id = ${resource_id};
        `);
        }
      }
      queryRunner.release();
      return true;
    } catch (error) {
      return error;
    }
  }
}
