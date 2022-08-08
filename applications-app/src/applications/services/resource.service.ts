import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateResourceInput } from '../dto/create-or-update-resource.inputs';
import { Resource } from '../models/resource.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
  ) {}

  async find(schoolYearId: number): Promise<Resource[]> {
    const data = await this.repo.find({
      where: { SchoolYearId: schoolYearId },
      order: { is_active: 'DESC', priority: 'ASC' },
    });
    return data;
  }

  async save(
    createResourceInput: CreateOrUpdateResourceInput,
  ): Promise<Resource> {
    try {
      if (!createResourceInput.resource_id) {
        const totalCnt = await this.repo.count({
          SchoolYearId: createResourceInput.SchoolYearId,
        });
        if (!createResourceInput.priority)
          createResourceInput.priority = totalCnt + 1;
      }
      const result = await this.repo.save(createResourceInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(resource_id: number): Promise<Boolean> {
    try {
      await this.repo.delete(resource_id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
