import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceLevel } from '../../models/resource-level.entity';

@Injectable()
export class ResourceLevelService {
  constructor(
    @InjectRepository(ResourceLevel)
    private readonly repo: Repository<ResourceLevel>,
  ) {}

  async cloneForResource(cloneResourceId: number, newResourceId: number) {
    const resourceLevels = await this.repo.find({ where: { resource_id: cloneResourceId } });
    for (let index = 0; index < resourceLevels.length; index++) {
      const resourceLevel = resourceLevels[index];

      delete resourceLevel.resource_level_id;
      delete resourceLevel.resource_id;
      delete resourceLevel.created_at;

      await this.repo.save({
        ...resourceLevel,
        resource_id: newResourceId,
      });
    }
  }
}
