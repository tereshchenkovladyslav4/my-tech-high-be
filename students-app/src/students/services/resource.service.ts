import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ToggleResourceCartInput } from '../dto/toggle-resource-cart.input';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { RequestResourcesInput } from '../dto/request-resources.input';
import { Resource } from '../models/resource.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ResourceRequestStatus } from '../enums';
import { StudentsService } from './students.service';
import { resourceUsername } from '../utils';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    private studentGradeLevelService: StudentGradeLevelsService,
    private studentsService: StudentsService,
  ) {}

  async find(studentId: number, schoolYearId: number): Promise<Resource[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findForStudentBySchoolYear(studentId, schoolYearId);

    if (!studentGradeLevel) {
      return [];
    }

    const { grade_level: gradeLevel } = studentGradeLevel;
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

    return data;
  }

  async toggleHiddenResource(toggleHiddenResourceInput: ToggleHiddenResourceInput): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    try {
      const { student_id, resource_id, hidden } = toggleHiddenResourceInput;
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
      return true;
    } catch (error) {
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async toggleResourceCart(toggleResourceCartInput: ToggleResourceCartInput): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    try {
      const { student_id, resource_id, resource_level_id, waitlist_confirmed, inCart } = toggleResourceCartInput;
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
      return true;
    } catch (error) {
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async requestResources(requestResourcesInput: RequestResourcesInput): Promise<boolean> {
    const queryRunner = await getConnection().createQueryRunner();
    try {
      const { student_id: stdId } = requestResourcesInput;
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

          eligibleSiblings = await this.studentsService.findSiblingsForResource(parentId, schoolYearId, grades);
        }

        const students = eligibleSiblings || [student?.[0]];
        for (let j = 0; j < students?.length; j++) {
          const { student_id: studentId } = students[j];
          const existing = await queryRunner.query(`
            SELECT * FROM infocenter.mth_resource_request
            WHERE student_id = ${studentId} AND resource_id = ${resourceId};
          `);
          const username = resourceUsername(resource, students[j]);
          const password = resource.std_password;
          if (!existing.length) {
            await queryRunner.query(`
              INSERT INTO infocenter.mth_resource_request
                (student_id, resource_id, resource_level_id, status, username, password, created_at, updated_at)
              VALUES
                (${studentId}, ${resourceId}, ${resourceLevelId}, "${
              waitlistConfirmed ? ResourceRequestStatus.WAITLIST : ResourceRequestStatus.REQUESTED
            }", "${username}", "${password}", NOW(), NOW());
            `);
          } else {
            await queryRunner.query(`
              UPDATE infocenter.mth_resource_request
              SET
                username = "${username}",
                password = "${password}",
                status = "${waitlistConfirmed ? ResourceRequestStatus.WAITLIST : ResourceRequestStatus.REQUESTED}"
              WHERE 
                student_id = ${studentId} AND
                resource_id = ${resourceId}
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
      return true;
    } catch (error) {
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
