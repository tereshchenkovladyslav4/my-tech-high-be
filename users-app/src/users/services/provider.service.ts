import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../../models/provider.entity';
import { PeriodService } from './period.service';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly repo: Repository<Provider>,
    private periodService: PeriodService,
  ) {}

  async cloneForSchoolYear(
    cloneSchoolYearId: number,
    newSchoolYearId: number,
    periodIdMap: { [key: number]: number },
  ): Promise<{ [key: number]: number }> {
    const providers = await this.repo.find({ where: { school_year_id: cloneSchoolYearId }, relations: ['Periods'] });
    const idMap: { [key: number]: number } = {};
    for (let index = 0; index < providers.length; index++) {
      const provider = providers[index];
      const providerId = provider.id;

      delete provider.id;
      delete provider.school_year_id;

      const periodIds = provider.Periods.map((x) => periodIdMap[x.id]);
      const periods = await this.periodService.findByIds(periodIds);

      const result = await this.repo.save({
        ...provider,
        school_year_id: newSchoolYearId,
        Periods: periods,
      });
      idMap[providerId] = result.id;
    }
    return idMap;
  }
}
