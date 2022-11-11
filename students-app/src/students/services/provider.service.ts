import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Provider } from '../models/provider.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly repo: Repository<Provider>,
  ) {}

  async find(schoolYearId: number): Promise<Provider[]> {
    const qb = this.repo
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.Periods', 'Periods')
      .where({ school_year_id: schoolYearId, is_active: true, deleted: false })
      .orderBy({ 'provider.id': 'ASC' });

    return await qb.getMany();
  }
}
