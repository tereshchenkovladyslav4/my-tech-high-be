import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from '../models/period.entity';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly repo: Repository<Period>,
  ) {}

  async find(schoolYearId: number): Promise<Period[]> {
    return await this.repo
      .createQueryBuilder('period')
      .where({ school_year_id: schoolYearId })
      .orderBy({ period: 'ASC', id: 'ASC' })
      .getMany();
  }

  async findByIds(periodIds: (number | string)[]): Promise<Period[]> {
    return await this.repo.findByIds(periodIds);
  }
}
