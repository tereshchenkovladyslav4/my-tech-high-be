import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../models/resource.entity';
import { ResourceLevelService } from './resource-level.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
    private resourceLevelService: ResourceLevelService,
  ) {}

  async cloneForSchoolYear(cloneSchoolYearId: number, newSchoolYearId: number) {
    const resources = await this.repo.find({ where: { SchoolYearId: cloneSchoolYearId } });
    for (let index = 0; index < resources.length; index++) {
      const resource = resources[index];
      const resourceId = resource.resource_id;

      delete resource.resource_id;
      delete resource.SchoolYearId;

      const result = await this.repo.save({
        ...resource,
        SchoolYearId: newSchoolYearId,
      });

      await this.resourceLevelService.cloneForResource(resourceId, result.resource_id);
    }
  }
}
