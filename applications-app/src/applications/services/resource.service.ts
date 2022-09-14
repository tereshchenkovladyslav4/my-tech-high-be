import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateResourceInput } from '../dto/create-or-update-resource.inputs';
import { ResourceLevel } from '../models/resource-level.entity';
import { Resource } from '../models/resource.entity';
import { ResourceLevelService } from './resource-level.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    private resourceLevelService: ResourceLevelService,
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
}
