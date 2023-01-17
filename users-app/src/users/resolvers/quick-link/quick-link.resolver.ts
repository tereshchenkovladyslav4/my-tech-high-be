import { BadRequestException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuickLink } from 'src/models/quick-link.entity';
import { QuickLinkInput } from 'src/users/dto/quickLink/quick-link.input';
import { QuickLinkService } from 'src/users/services/quick-link/quick-link.service';

@Resolver(() => QuickLink)
export class QuickLinkResolver {
  constructor(private quickLinkService: QuickLinkService) {}

  @Query(() => [QuickLink], { name: 'getQuickLinksByRegion' })
  getQuickLinksByRegion(@Args({ name: 'regionId', type: () => ID }) regionId: number): Promise<QuickLink[]> {
    return this.quickLinkService.findByRegion(regionId);
  }

  @Mutation(() => QuickLink, { name: 'createQuickLink' })
  async createQuickLink(
    @Args('quickLinkInput')
    quickLinkInput: QuickLinkInput,
  ): Promise<QuickLink> {
    const { quickLink } = quickLinkInput;
    const response = this.quickLinkService.createQuickLink(quickLink);
    return response;
  }

  @Mutation(() => QuickLink, { name: 'updateQuickLink' })
  async updateQuickLink(
    @Args('quickLinkInput')
    quickLinkInput: QuickLinkInput,
  ): Promise<QuickLink> {
    const { quickLink } = quickLinkInput;
    const response = await this.quickLinkService.updateQuickLink(quickLink);
    return response;
  }

  @Mutation(() => QuickLink, { name: 'removeQuickLinkPhoto' })
  async removeQuickLinkPhoto(@Args({ name: 'id', type: () => ID }) id: number): Promise<QuickLink> {
    const quickLink = await this.quickLinkService.findById(id);
    if (!quickLink) throw new BadRequestException();

    return await this.quickLinkService.removePhoto(id);
  }
}
