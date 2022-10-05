import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Resource } from '../models/resource.entity';
import { ResourceService } from '../services/resource.service';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { ToggleResourceCartInput } from '../dto/toggle-resource-cart.input';
import { RequestResourcesInput } from '../dto/request-resources.input';

@Resolver((of) => Resource)
export class ResourceResolver {
  constructor(private service: ResourceService) {}

  @Query((returns) => [Resource], { name: 'studentResources' })
  @UseGuards(new AuthGuard())
  get(@Args({ name: 'studentId', type: () => ID }) studentId: number): Promise<Resource[]> {
    return this.service.find(studentId);
  }

  @Mutation((returns) => Boolean)
  async toggleHiddenResource(
    @Args('toggleHiddenResourceInput')
    toggleHiddenResourceInput: ToggleHiddenResourceInput,
  ) {
    return this.service.toggleHiddenResource(toggleHiddenResourceInput);
  }

  @Mutation((returns) => Boolean)
  async toggleResourceCart(
    @Args('toggleResourceCartInput')
    toggleResourceCartInput: ToggleResourceCartInput,
  ) {
    return this.service.toggleResourceCart(toggleResourceCartInput);
  }

  @Mutation((returns) => Boolean)
  async requestResources(
    @Args('requestResourcesInput')
    requestResourcesInput: RequestResourcesInput,
  ) {
    return this.service.requestResources(requestResourcesInput);
  }
}
