import { Args, Resolver, Mutation, Context } from '@nestjs/graphql';
import { Region } from '../models/region.entity';
import { CloneRegionInput } from '../dto/clone-region.inputs';
import { RegionsService } from '../services/regions.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Resolver(() => Region)
export class RegionsResolver {
  constructor(private regionsService: RegionsService) {}

  @Mutation(() => Region, {
    name: 'cloneRegion',
  })
  @UseGuards(new AuthGuard())
  async cloneRegion(
    @Context('user') user: any,
    @Args('CloneRegionInput')
    cloneRegionInput: CloneRegionInput,
  ): Promise<Region> {
    return await this.regionsService.clone(cloneRegionInput, user.username);
  }
}
