import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CoreSetting } from '../models/core-setting.entity';

@Injectable()
export class CoreSettingsService {
  constructor(
    @InjectRepository(CoreSetting)
    private coreSettingsRepository: Repository<CoreSetting>,
  ) {}

  async findOneByName( name: string ): Promise<CoreSetting> {
      return this.coreSettingsRepository.findOne({
          where: {
              name: name
          }
      });
  }

  async findOneByCategory( category: string ): Promise<CoreSetting[]> {
        return this.coreSettingsRepository.find({
            where: {
                category: category
            }
        });
    }

  async getSiteSettings(): Promise<CoreSetting[]> {
      return this.coreSettingsRepository.find({
            name: Like("site%")
        });
  }

}
