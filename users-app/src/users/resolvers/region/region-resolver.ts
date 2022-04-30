import { AuthGuard } from './../../guards/auth.guard';
import {
  HttpException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../services/users.service';
import { Region } from '../../../models/region.entity';
import { CreateRegionInput } from '../../dto/region/create-region.input';
import { UpdateRegionInput } from '../../dto/region/update-region.input';
import { RegionService } from '../../services/region/region.service';

@Resolver((of) => Region)
export class RegionResolver {
  constructor(
    private regionService: RegionService,
    private userService: UsersService,
  ) {}

  @Query(() => Region, { name: 'region', nullable: true })
  @UseGuards(new AuthGuard())
  getRegion(@Args({ name: 'id', type: () => ID }) id: number): Promise<Region> {
    return this.regionService.findRegionById(id);
  }

  @Query(() => [Region], { name: 'regions' })
  //@UseGuards(new AuthGuard())
  getRegions(): Promise<Region[]> {
    return this.regionService.getAllRegions();
  }

  // @UseGuards(new AuthGuard())
  @Mutation((of) => Region, { name: 'createRegion' })
  @UseGuards(new AuthGuard())
  async createRegion(
    @Args('createRegionInput') createRegionInput: CreateRegionInput,
  ): Promise<Region> {
    if (
      (await this.userService.validateCreator(createRegionInput.creator_id)) ===
      true
    ) {
      const response = await this.regionService.createRegion(createRegionInput);
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation((of) => Region, { name: 'updateRegion' })
  @UseGuards(new AuthGuard())
  async updateRegion(
    @Args('updateRegionInput') updateRegionInput: UpdateRegionInput,
  ): Promise<Region> {
    const response = await this.regionService.updateRegion(updateRegionInput);
    return response;
  }

  @Mutation((of) => String, { name: 'removeRegion' })
  @UseGuards(new AuthGuard())
  public async removeRegion(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<String> {
    const response = await this.regionService.removeRegionById(id);
    return response;
  }

  @Mutation((of) => String, { name: 'removeCountyInfoByRegionId' })
  @UseGuards(new AuthGuard())
  public async removeCountyInfoByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<String> {
    const response = await this.regionService.removeCountyInfoByRegionId(
      region_id,
    );
    return response;
  }

  @Mutation((of) => String, { name: 'removeSchoolDistrictInfoByRegionId' })
  @UseGuards(new AuthGuard())
  public async removeSchoolDistrictInfoByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<String> {
    const response =
      await this.regionService.removeSchoolDistrictInfoByRegionId(region_id);
    return response;
  }
}
