import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateResourceInput } from '../dto/create-or-update-resource.inputs';
import { ResourceLevel } from '../models/resource-level.entity';
import { Resource } from '../models/resource.entity';
import { ResourceLevelService } from './resource-level.service';
import { ResourceRequestStatus, ResourceSubtitle, UsernameFormat } from '../enums';
import { StudentsService } from './students.service';
import { ResourceRequest } from '../models/resource-request.entity';
import { ResourceCart } from '../models/resource-cart.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    @InjectRepository(ResourceRequest)
    private readonly resourceRequestRepo: Repository<ResourceRequest>,
    @InjectRepository(ResourceCart)
    private readonly resourceCartRepo: Repository<ResourceCart>,
    private resourceLevelService: ResourceLevelService,
    private studentsService: StudentsService,
  ) {}

  async find(schoolYearId: number): Promise<Resource[]> {
    return await this.repo
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.ResourceLevels', 'ResourceLevels')
      .where({ SchoolYearId: schoolYearId })
      .orderBy({
        'resource.is_active': 'DESC',
        'resource.priority': 'ASC',
        'resource.resource_id': 'ASC',
        'ResourceLevels.resource_level_id': 'ASC',
      })
      .getMany();
  }

  async save(resourceInput: CreateOrUpdateResourceInput): Promise<Resource> {
    try {
      if (!resourceInput.resource_id) {
        const totalCnt = await this.repo.count({
          SchoolYearId: resourceInput.SchoolYearId,
        });
        if (!resourceInput.priority) resourceInput.priority = totalCnt + 1;
      }

      const result = await this.repo.save(resourceInput);

      if (resourceInput.resourceLevelsStr) {
        let existingLevels: ResourceLevel[] = [];
        if (resourceInput.resource_id) {
          existingLevels = await this.resourceLevelService.find(resourceInput.resource_id);
        }
        const resourceLevels = JSON.parse(resourceInput.resourceLevelsStr);

        existingLevels.map(async (item) => {
          if (resourceLevels.findIndex((newLevel) => newLevel.resource_level_id == item.resource_level_id) < 0) {
            await this.resourceLevelService.delete(item.resource_level_id);
          }
        });

        for (let i = 0; i < resourceLevels?.length; i++) {
          await this.resourceLevelService.save({
            ...resourceLevels[i],
            resource_id: result.resource_id,
          });
        }
      }

      await this.processIncludeResource(result);

      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(resource_id: number): Promise<boolean> {
    try {
      await this.repo.delete(resource_id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async processIncludeResource(resource: Resource): Promise<boolean> {
    try {
      const { subtitle, std_username_format, std_user_name } = resource;
      if (subtitle == ResourceSubtitle.INCLUDED) {
        const students = await this.studentsService.findStudentsForResource(resource.SchoolYearId, resource.grades);
        students.map(async (student) => {
          const { student_id: studentId } = student;
          const { resource_id: resourceId } = resource;
          const status =
            std_username_format === UsernameFormat.GENERIC && !!std_user_name
              ? ResourceRequestStatus.ACCEPTED
              : ResourceRequestStatus.REQUESTED;

          await this.resourceCartRepo.delete({ student_id: studentId, resource_id: resourceId });
          const existing = await this.resourceRequestRepo.findOne({ student_id: studentId, resource_id: resourceId });
          if (!existing) {
            await this.resourceRequestRepo.save({
              student_id: studentId,
              resource_id: resourceId,
              status,
            });
          } else if (status != existing.status) {
            await this.resourceRequestRepo.save({ ...existing, status });
          }
        });
      }
      return true;
    } catch {
      return false;
    }
  }
}
