import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings.entity';
import { UpdateSettingsInput } from '../dto/update-settings.input';
import { ImmunizationSettingsService } from '../services/immunization-settings.service';

@Resolver(() => Student)
export class SettingsResolver {
  constructor(private settingsService: SettingsService, private immunizationService: ImmunizationSettingsService) {}

  @Query(() => Settings, { name: 'settings' })
  public async getSettings(): Promise<Settings> {
    return this.settingsService.findFirst();
  }

  @Mutation(() => Settings, { name: 'updateSettings' })
  async updateSettings(
    @Args('input')
    input: UpdateSettingsInput,
  ): Promise<Settings> {
    if (input.enable_immunizations === 0) {
      const allImmunizations = await this.immunizationService.findAll({});
      allImmunizations.results.forEach((e) => {
        this.immunizationService.updateOrAdd({
          id: e.id,
          region_id: e.region_id,
          // max_grade_level: '',
          // min_grade_level: ''
        });
      });
    }
    return this.settingsService.updateSettings(input);
  }
}
