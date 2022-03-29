import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImmunizationSettings } from '../models/immunization-settings.entity';
import { Pagination } from '../../paginate';
import { UpdateImmunizationSettingsInput } from '../dto/update-immunization-settings.input';
import { FindImunizationSettingsInput } from '../dto/find-immunization';

@Injectable()
export class ImmunizationSettingsService {
  constructor(
    @InjectRepository(ImmunizationSettings)
    private readonly immunizationSettingsRepository: Repository<ImmunizationSettings>,
  ) { }

  async findAll(
    where: FindImunizationSettingsInput | null,
  ): Promise<Pagination<ImmunizationSettings>> {
    let qb = this.immunizationSettingsRepository
      .createQueryBuilder(
        'immunization_settings',
      ).orderBy('immunization_settings.order', 'ASC')
      .where('immunization_settings.is_deleted = 0');
    if (typeof where?.is_enabled !== 'undefined') {
      qb = qb.where(
        'immunization_settings.is_enabled = ' +
        (where.is_enabled ? 1 : 0),
      );
    }
    const [results, total] = await qb.getManyAndCount();


    return new Pagination<ImmunizationSettings>({
      results: this.sortImmunizations(results),
      total,
    });
  }

  private sortImmunizations(immunizations: ImmunizationSettings[]) {
    function getConsecutivesId(imId: number,) {
      let ids: number[] = []
      for (const im of immunizations) {
        if (im.consecutive_vaccine === imId) {
          ids = [...ids, im.id, ...getConsecutivesId(im.id)]
        }
      }
      return ids
    }

    let sortedRes: ImmunizationSettings[] = []
    for (const e of immunizations) {
      if (!e.id || !e.title) continue
      if (e.consecutive_vaccine === 0) {
        e.consecutives = getConsecutivesId(e.id)
        sortedRes = [
          ...sortedRes,
          e,
          ...e.consecutives.map((id) => immunizations.find((v) => v.id === id))
        ]
      }
    }
    return sortedRes
  }

  async updateOrAdd(input: UpdateImmunizationSettingsInput) {
    const one = await this.immunizationSettingsRepository.save(input);
    return one;
  }

  async deleteOne(id: number): Promise<boolean> {
    const affected = await this.immunizationSettingsRepository.save({
      id,
      is_deleted: true
    })
    return affected ? true : false;
  }

  async updateOrder(ids: string[]): Promise<boolean> {
    const orderIds = ids.map((id, index) => {
      return { id: parseInt(id), order: index };
    });
    const res = this.immunizationSettingsRepository
      .save(orderIds)
      .then(() => true)
      .catch(() => false);
    return res;
  }
}
