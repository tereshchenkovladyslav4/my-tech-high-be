import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ToggleResourceCartInput } from '../dto/toggle-resource-cart.input';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { RequestResourcesInput } from '../dto/request-resources.input';
import { Resource } from '../models/resource.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ResourceRequestStatus } from '../enums';

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
    // student_id + resource_id is primary key in mth_student)hidden_resource and mth_resource_cart
    // They are one to one relationship.
    const data: Resource[] = await queryRunner.query(`
      SELECT 
        resource.*,
        student_hidden_resource.student_id AS HiddenByStudent,
        resource_cart.created_at AS CartDate,
        resource_request.status AS RequestStatus
      FROM 
        infocenter.mth_resource_settings AS resource
      LEFT JOIN 
        infocenter.mth_student_hidden_resource student_hidden_resource 
      ON (
        resource.resource_id = student_hidden_resource.resource_id AND
        student_hidden_resource.student_id = ${studentId}
      )
      LEFT JOIN 
        infocenter.mth_resource_cart resource_cart
      ON (
        resource.resource_id = resource_cart.resource_id AND
        resource_cart.student_id = ${studentId}
      )
      LEFT JOIN 
        infocenter.mth_resource_request resource_request
      ON (
        resource.resource_id = resource_request.resource_id AND
        resource_request.student_id = ${studentId}
      )
      WHERE
        SchoolYearId = ${schoolYearId} AND is_active = 1
      ORDER BY
        HiddenByStudent ASC, resource.priority ASC;
    `);
    data.map((item) => (item.HiddenByStudent = !!item.HiddenByStudent));
    queryRunner.release();
    return data;
  }

  async toggleHiddenResource(
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

  async toggleResourceCart(
    toggleResourceCartInput: ToggleResourceCartInput,
  ): Promise<Boolean> {
    try {
      const { student_id, resource_id, inCart } = toggleResourceCartInput;
      const queryRunner = await getConnection().createQueryRunner();
      const existing = await queryRunner.query(`
        SElECT * FROM infocenter.mth_resource_cart
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

  async requestResources(
    requestResourcesInput: RequestResourcesInput,
  ): Promise<Boolean> {
    try {
      const { student_id, resourceIds } = requestResourcesInput;
      resourceIds.map(async (resourcId) => {
        const queryRunner = await getConnection().createQueryRunner();
        const existing = await queryRunner.query(`
          SElECT * FROM infocenter.mth_resource_request
          WHERE student_id = ${student_id} AND resource_id = ${resourcId};
        `);

        if (!existing.length) {
          await queryRunner.query(`
            INSERT INTO infocenter.mth_resource_request
              (student_id, resource_id, status, created_at, updated_at)
            VALUES
              (${student_id}, ${resourcId}, "${ResourceRequestStatus.REQUESTED}", NOW(), NOW());
          `);
        } else {
          await queryRunner.query(`
            UPDATE infocenter.mth_resource_request
            SET status = "${ResourceRequestStatus.REQUESTED}", updated_at = NOW()
            WHERE student_id = ${student_id} AND resource_id = ${resourcId};
          `);
        }
        // Delete from cart
        await queryRunner.query(`
          DELETE FROM infocenter.mth_resource_cart
          WHERE student_id = ${student_id} AND resource_id = ${resourcId};
        `);
        queryRunner.release();
      });
      return true;
    } catch (error) {
      return error;
    }
  }
}
