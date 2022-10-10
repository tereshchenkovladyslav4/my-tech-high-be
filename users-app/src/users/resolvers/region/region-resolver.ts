import { AuthGuard } from '../../guards/auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../services/users.service';
import { Region } from '../../../models/region.entity';
import { CreateRegionInput } from '../../dto/region/create-region.input';
import { UpdateRegionInput } from '../../dto/region/update-region.input';
import { RegionService } from '../../services/region/region.service';

@Resolver(() => Region)
export class RegionResolver {
  constructor(private regionService: RegionService, private userService: UsersService) {}

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
  @Mutation(() => Region, { name: 'createRegion' })
  @UseGuards(new AuthGuard())
  async createRegion(@Args('createRegionInput') createRegionInput: CreateRegionInput): Promise<Region> {
    if ((await this.userService.validateCreator(createRegionInput.creator_id)) === true) {
      return await this.regionService.createRegion(createRegionInput);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => Region, { name: 'updateRegion' })
  @UseGuards(new AuthGuard())
  async updateRegion(@Args('updateRegionInput') updateRegionInput: UpdateRegionInput): Promise<Region> {
    return await this.regionService.updateRegion(updateRegionInput);
  }

  @Mutation(() => String, { name: 'removeRegion' })
  @UseGuards(new AuthGuard())
  public async removeRegion(@Args({ name: 'id', type: () => ID }) id: number): Promise<string> {
    return await this.regionService.removeRegionById(id);
  }

  @Mutation(() => String, { name: 'removeCountyInfoByRegionId' })
  @UseGuards(new AuthGuard())
  public async removeCountyInfoByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<string> {
    return await this.regionService.removeCountyInfoByRegionId(region_id);
  }

  @Mutation(() => String, { name: 'removeSchoolDistrictInfoByRegionId' })
  @UseGuards(new AuthGuard())
  public async removeSchoolDistrictInfoByRegionId(
    @Args({ name: 'region_id', type: () => ID }) region_id: number,
  ): Promise<string> {
    return await this.regionService.removeSchoolDistrictInfoByRegionId(region_id);
  }
}
