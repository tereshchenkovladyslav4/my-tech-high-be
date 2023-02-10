import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateHomeroomSettingInput } from '../dto/create-or-update-homeroom-setting.inputs';
import { HomeroomSettings } from '../models/homeroom-settings.entity';

@Injectable()
export class HomeroomSettingsService {
  constructor(
    @InjectRepository(HomeroomSettings)
    private readonly repository: Repository<HomeroomSettings>,
  ) {}

  async find(school_year_id: number): Promise<HomeroomSettings[]> {
    const result = await this.repository
      .createQueryBuilder('homeroomSettings')
      .where('homeroomSettings.SchoolYearId = :schoolYearId', { schoolYearId: school_year_id })
      .getMany();

    return result;
  }

  async save(settingInput: CreateOrUpdateHomeroomSettingInput): Promise<HomeroomSettings> {
    try {
      const result = await this.repository.save({ ...settingInput });
      return result;
    } catch (error) {
      return error;
    }
  }
}
