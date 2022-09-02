import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ToggleResourceCartInput } from '../dto/toggle-resource-cart.input';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { RequestResourcesInput } from '../dto/request-resources.input';
import { Resource } from '../models/resource.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ResourceRequestStatus, StudentStatusEnum } from '../enums';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    private studentGradeLevelService: StudentGradeLevelsService,
  ) {}

  async find(studentId: number): Promise<Resource[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }

    const { school_year_id: schoolYearId, grade_level: gradeLevel } = studentGradeLevel;

    const queryRunner = await getConnection().createQueryRunner();

    const data = await this.repo
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.HiddenStudents', 'HiddenStudents', `HiddenStudents.student_id=${studentId}`)
      .leftJoinAndSelect('resource.StudentsInCart', 'StudentsInCart', `StudentsInCart.student_id=${studentId}`)
      .leftJoinAndSelect('resource.ResourceRequests', 'ResourceRequests', `ResourceRequests.student_id=${studentId}`)
      .leftJoinAndSelect('resource.ResourceLevels', 'ResourceLevels')
      .where({ SchoolYearId: schoolYearId, is_active: 1 })
      .andWhere(`find_in_set('${gradeLevel}',grades) <> 0`)
      .orderBy({
        'HiddenStudents.resource_id': 'ASC',
        'resource.priority': 'ASC',
      })
      .getMany();

    data.map(
      (item) => (
        (item.HiddenByStudent = !!item.HiddenStudents?.length),
        (item.CartDate = item.StudentsInCart?.[0]?.created_at),
        (item.RequestStatus = item.ResourceRequests?.[0]?.status)
      ),
    );
    queryRunner.release();
    return data;
  }

  async toggleHiddenResource(toggleHiddenResourceInput: ToggleHiddenResourceInput): Promise<Boolean> {
    try {
      const { student_id, resource_id, hidden } = toggleHiddenResourceInput;
      const queryRunner = await getConnection().createQueryRunner();
      const existing = await queryRunner.query(`
        SELECT * FROM infocenter.mth_student_hidden_resource
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

  async toggleResourceCart(toggleResourceCartInput: ToggleResourceCartInput): Promise<Boolean> {
    try {
      const { student_id, resource_id, inCart } = toggleResourceCartInput;
      const queryRunner = await getConnection().createQueryRunner();
      const existing = await queryRunner.query(`
        SELECT * FROM infocenter.mth_resource_cart
        WHERE student_id = ${student_id} AND resource_id = ${resource_id};
      `);
      if (inCart) {
        if (!existing.length) {
          await queryRunner.query(`
            INSERT INTO infocenter.mth_resource_cart
              (student_id, resource_id, created_at)
            VALUES
              (${student_id}, ${resource_id}, NOW());
          `);
        }
      } else {
        if (!!existing.length) {
          await queryRunner.query(`
            DELETE FROM infocenter.mth_resource_cart
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

  async requestResources(requestResourcesInput: RequestResourcesInput): Promise<Boolean> {
    try {
      const { student_id: stdId, resourceIds } = requestResourcesInput;
      const queryRunner = await getConnection().createQueryRunner();
      const student = await queryRunner.query(`
        SELECT * FROM infocenter.mth_student
        WHERE student_id = ${stdId};
      `);
      queryRunner.release();
      const { parent_id: parentId } = student?.[0];

      resourceIds.map(async (resourceId) => {
        const queryRunner = await getConnection().createQueryRunner();

        const resource = await queryRunner.query(`
          SELECT * FROM infocenter.mth_resource_settings
          WHERE resource_id = ${resourceId};
        `);

        let eligibleSiblings = null;
        if (resource?.[0].family_resource && parentId) {
          const { SchoolYearId: schoolYearId, grades } = resource[0];

          eligibleSiblings = await queryRunner.query(`
              SELECT student.student_id FROM infocenter.mth_student as student
              LEFT JOIN mth_student_status as student_status ON student_status.student_id = student.student_id
              LEFT JOIN mth_student_grade_level as student_grade_level ON student_grade_level.student_id = student.student_id
              WHERE 
                parent_id = ${parentId} AND 
                student_status.school_year_id = ${schoolYearId} AND 
                student_status.status = ${StudentStatusEnum.ACTIVE} AND 
                student_grade_level.school_year_id = ${schoolYearId} 
                AND FIND_IN_SET(student_grade_level.grade_level,'${grades}') <> 0;
            `);
        }
        queryRunner.release();

        (eligibleSiblings || [{ student_id: stdId }]).map(async ({ student_id }) => {
          await this.requestResource(student_id, resourceId);
        });
      });
      return true;
    } catch (error) {
      return error;
    }
  }

  private async requestResource(studentId: number, resourceId: number) {
    const queryRunner = await getConnection().createQueryRunner();
    const existing = await queryRunner.query(`
      SELECT * FROM infocenter.mth_resource_request
      WHERE student_id = ${studentId} AND resource_id = ${resourceId};
    `);
    if (!existing.length) {
      await queryRunner.query(`
        INSERT INTO infocenter.mth_resource_request
          (student_id, resource_id, status, created_at, updated_at)
        VALUES
          (${studentId}, ${resourceId}, "${ResourceRequestStatus.REQUESTED}", NOW(), NOW());
      `);
    }
    // Delete from cart
    await queryRunner.query(`
      DELETE FROM infocenter.mth_resource_cart
      WHERE student_id = ${studentId} AND resource_id = ${resourceId};
    `);
    queryRunner.release();
  }
}
