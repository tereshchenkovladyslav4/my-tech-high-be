import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Resource } from '../models/resource.entity';
import { ResourceService } from '../services/resource.service';
import { CreateOrUpdateResourceInput } from '../dto/create-or-update-resource.inputs';

@Resolver(() => Resource)
export class ResourceResolver {
  constructor(private service: ResourceService) {}

  @Query(() => [Resource], { name: 'resources' })
  @UseGuards(new AuthGuard())
  get(@Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number): Promise<Resource[]> {
    return this.service.find(schoolYearId);
  }

  @Mutation(() => Resource, { name: 'createOrUpdateResource' })
  @UseGuards(new AuthGuard())
  async createOrUpdateResource(
    @Args('createResourceInput')
    createResourceInput: CreateOrUpdateResourceInput,
  ): Promise<Resource> {
    return this.service.save(createResourceInput);
  }

  @Mutation(() => Boolean, { name: 'deleteResource' })
  @UseGuards(new AuthGuard())
  async deleteResource(
    @Args('resource_id')
    resource_id: number,
  ): Promise<boolean> {
    return this.service.delete(resource_id);
  }
}
