import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { HomeroomSettings } from '../models/homeroom-settings.entity';
import { HomeroomSettingsService } from '../services/homeroom-settings.service';
import { CreateOrUpdateHomeroomSettingInput } from '../dto/create-or-update-homeroom-setting.inputs';

@Resolver(() => HomeroomSettings)
export class HomeroomSettingsResolver {
  constructor(private service: HomeroomSettingsService) {}

  @Query(() => [HomeroomSettings], { name: 'homeroomSettingBySchoolYearId' })
  @UseGuards(new AuthGuard())
  get(
    @Args('school_year_id')
    school_year_id: number,
  ): Promise<HomeroomSettings[]> {
    return this.service.find(school_year_id);
  }

  @Mutation(() => HomeroomSettings, { name: 'createOrUpdateHomeroomSetting' })
  @UseGuards(new AuthGuard())
  async createOrUpdateHomeroomSetting(
    @Args('createHomeroomSettingInput')
    createHomeroomSettingInput: CreateOrUpdateHomeroomSettingInput,
  ): Promise<HomeroomSettings> {
    return this.service.save(createHomeroomSettingInput);
  }
}
