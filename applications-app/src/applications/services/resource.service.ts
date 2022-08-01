import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      order: { sequence: 'ASC' },
    });
    return data;
  }
}
