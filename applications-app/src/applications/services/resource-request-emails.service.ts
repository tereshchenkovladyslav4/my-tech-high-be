import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceRequestEmail } from '../models/resource-request-email.entity';
import { ResourceRequestEmailInputs } from '../dto/resource-request-email.inputs';
@Injectable()
export class ResourceRequestEmailsService {
  constructor(
    @InjectRepository(ResourceRequestEmail)
    private readonly repo: Repository<ResourceRequestEmail>,
  ) {}

  async findByIds(resourceRequestIds: number[]): Promise<ResourceRequestEmail[]> {
    return this.repo
      .createQueryBuilder('resourceRequestEmail')
      .leftJoinAndSelect('resourceRequestEmail.EmailRecord', 'EmailRecord')
      .whereInIds(resourceRequestIds)
      .getMany();
  }

  async create(resourceRequestEmail: ResourceRequestEmailInputs): Promise<ResourceRequestEmail> {
    return this.repo.save(resourceRequestEmail);
  }
}
