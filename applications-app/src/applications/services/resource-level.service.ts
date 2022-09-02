import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceLevel } from '../models/resource-level.entity';
import { ResourceLevelInput } from '../dto/resource-level.inputs';

@Injectable()
export class ResourceLevelService {
  constructor(
    @InjectRepository(ResourceLevel)
    private readonly repo: Repository<ResourceLevel>,
  ) {}

  async find(resourceId: number): Promise<ResourceLevel[]> {
    const data = await this.repo.find({
      where: { resource_id: resourceId },
    });
    return data;
  }

  async save(resourceLevelInput: ResourceLevelInput): Promise<ResourceLevel> {
    try {
      return await this.repo.save(resourceLevelInput);
    } catch (error) {
      return error;
    }
  }

  async delete(resourceLevelId: number): Promise<Boolean> {
    try {
      await this.repo.delete(resourceLevelId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
