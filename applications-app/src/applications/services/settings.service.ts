import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../models/settings.entity';
import { UpdateSettingsInput } from '../dto/update-settings.input';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) { }

  async findFirst(): Promise<Settings> {
    const res = await this.settingsRepository.findOne(1);
    if (!res) {
      return this.updateSettings({ enable_immunizations: 1 })
    }
    return res
  }

  async updateSettings(input: UpdateSettingsInput): Promise<Settings> {
    return this.settingsRepository.save({
      id: 1,
      enable_immunizations: input.enable_immunizations
    })
  }
}
