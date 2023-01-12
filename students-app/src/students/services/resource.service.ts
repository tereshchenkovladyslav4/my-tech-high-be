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

  async find(studentId: number, schoolYearId: number): Promise<Resource[]> {
    const studentGradeLevel = await this.studentGradeLevelService.find(studentId, schoolYearId);

    if (!studentGradeLevel) {
      return [];
    }

    const { grade_level: gradeLevel } = studentGradeLevel;

    const queryRunner = await getConnection().createQueryRunner();
    // TODO Total requests should be calculated for only accepted requests

    const data = await this.repo
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.HiddenStudents', 'HiddenStudents', `HiddenStudents.student_id=${studentId}`)
      .leftJoinAndSelect('resource.StudentsInCart', 'StudentsInCart', `StudentsInCart.student_id=${studentId}`)
      .leftJoinAndSelect('resource.ResourceRequests', 'ResourceRequests', `ResourceRequests.student_id=${studentId}`)
      .leftJoinAndSelect('resource.ResourceLevels', 'ResourceLevels')
      .loadRelationCountAndMap('resource.TotalRequests', 'resource.ResourceRequests')
      .loadRelationCountAndMap('ResourceLevels.TotalRequests', 'ResourceLevels.ResourceRequests')
      .where({ is_active: 1, SchoolYearId: schoolYearId })
      .andWhere(`find_in_set('${gradeLevel}',resource.grades) <> 0`)
      .orderBy({
        'HiddenStudents.resource_id': 'ASC',
        'resource.priority': 'ASC',
      })
      .getMany();

    data.map(
      (item) => (
        (item.HiddenByStudent = !!item.HiddenStudents?.length),
        (item.CartDate = item.StudentsInCart?.[0]?.created_at),
        (item.WaitListConfirmed = !!item.StudentsInCart?.[0]?.waitlist_confirmed),
        (item.ResourceLevelId =
          item.ResourceRequests?.[0]?.resource_level_id || item.StudentsInCart?.[0]?.resource_level_id),
        (item.RequestStatus = item.ResourceRequests?.[0]?.status)
      ),
    );

    await queryRunner.release();
    return data;
  }

  async toggleHiddenResource(toggleHiddenResourceInput: ToggleHiddenResourceInput): Promise<boolean> {
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
      await queryRunner.release();
      return true;
    } catch (error) {
      return error;
    }
  }

  async toggleResourceCart(toggleResourceCartInput: ToggleResourceCartInput): Promise<boolean> {
    try {
      const { student_id, resource_id, resource_level_id, waitlist_confirmed, inCart } = toggleResourceCartInput;
      const queryRunner = await getConnection().createQueryRunner();
      const existing = await queryRunner.query(`
        SELECT * FROM infocenter.mth_resource_cart
        WHERE student_id = ${student_id} AND resource_id = ${resource_id};
      `);
      if (inCart) {
        if (!existing.length) {
          await queryRunner.query(`
            INSERT INTO infocenter.mth_resource_cart
              (student_id, resource_id, resource_level_id, waitlist_confirmed, created_at)
            VALUES
              (${student_id}, ${resource_id}, ${resource_level_id}, ${waitlist_confirmed}, NOW());
          `);
        } else {
          await queryRunner.query(`
            UPDATE infocenter.mth_resource_cart
            SET waitlist_confirmed=${waitlist_confirmed}
            WHERE student_id = ${student_id} AND resource_id = ${resource_id};
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
      await queryRunner.release();
      return true;
    } catch (error) {
      return error;
    }
  }

  async requestResources(requestResourcesInput: RequestResourcesInput): Promise<boolean> {
    try {
      const { student_id: stdId } = requestResourcesInput;

      const queryRunner = await getConnection().createQueryRunner();
      const resourcesInCart = await queryRunner.query(`
          SELECT * FROM infocenter.mth_resource_cart
          WHERE student_id = ${stdId};
      `);

      const student = await queryRunner.query(`
        SELECT * FROM infocenter.mth_student
        WHERE student_id = ${stdId};
      `);

      const { parent_id: parentId } = student?.[0];

      let i;
      for (i = 0; i < resourcesInCart?.length; i++) {
        const {
          resource_id: resourceId,
          resource_level_id: resourceLevelId,
          waitlist_confirmed: waitlistConfirmed,
        } = resourcesInCart[i];

        const resource = await this.repo
          .createQueryBuilder('resource')
          .leftJoinAndSelect('resource.ResourceRequests', 'ResourceRequests')
          .leftJoinAndSelect('resource.ResourceLevels', 'ResourceLevels')
          .loadRelationCountAndMap('resource.TotalRequests', 'resource.ResourceRequests')
          .loadRelationCountAndMap('ResourceLevels.TotalRequests', 'ResourceLevels.ResourceRequests')
          .where({ resource_id: resourceId })
          .getOne();

        const resourceLevel = resource.ResourceLevels?.find(
          (resourceLevel) => resourceLevel.resource_level_id == resourceLevelId,
        );
        const limitSum = resource.ResourceLevels?.reduce((acc, cur) => (acc += cur?.limit || 0), 0);
        if (
          ((!!resource.resource_limit && resource.resource_limit <= resource.TotalRequests) ||
            (!!limitSum && limitSum <= resource.TotalRequests) ||
            (!!resourceLevel?.limit && resourceLevel?.limit <= resourceLevel?.TotalRequests)) &&
          !waitlistConfirmed
        ) {
          break;
        }

        let eligibleSiblings = null;
        if (resource?.family_resource && parentId) {
          const { SchoolYearId: schoolYearId, grades } = resource;

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

        const students = eligibleSiblings || [{ student_id: stdId }];
        for (let j = 0; j < students?.length; j++) {
          const { student_id: studentId } = students[j];
          const existing = await queryRunner.query(`
            SELECT * FROM infocenter.mth_resource_request
            WHERE student_id = ${studentId} AND resource_id = ${resourceId};
          `);
          if (!existing.length) {
            await queryRunner.query(`
              INSERT INTO infocenter.mth_resource_request
                (student_id, resource_id, resource_level_id, status, created_at, updated_at)
              VALUES
                (${studentId}, ${resourceId}, ${resourceLevelId}, "${ResourceRequestStatus.REQUESTED}", NOW(), NOW());
            `);
          } else {
            await queryRunner.query(`
              UPDATE infocenter.mth_resource_request
              SET
                status = "${ResourceRequestStatus.REQUESTED}"
              WHERE 
                student_id = ${studentId} AND
                resource_id = ${resourceId} AND
                resource_level_id = ${resourceLevelId}
            `);
          }
          // Delete from cart
          await queryRunner.query(`
            DELETE FROM infocenter.mth_resource_cart 
            WHERE student_id = ${studentId} AND resource_id = ${resourceId};
          `);
        }
      }

      if (i < resourcesInCart?.length) {
        // Transaction failed. Have to confirm waitlist again
        queryRunner.clearSqlMemory();
        await queryRunner.release();
        return false;
      }
      await queryRunner.release();
      return true;
    } catch (error) {
      return error;
    }
  }
}
