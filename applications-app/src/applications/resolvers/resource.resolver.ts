import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Resource } from '../models/resource.entity';
import { ResourceService } from '../services/resource.service';

@Resolver((of) => Resource)
export class ResourceResolver {
  constructor(private service: ResourceService) {}

  @Query((returns) => [Resource], { name: 'resources' })
  @UseGuards(new AuthGuard())
  get(
    @Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number,
  ): Promise<Resource[]> {
    return this.service.find(schoolYearId);
  }
}
