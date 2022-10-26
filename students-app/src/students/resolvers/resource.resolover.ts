import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Resource } from '../models/resource.entity';
import { ResourceService } from '../services/resource.service';
import { ToggleHiddenResourceInput } from '../dto/toggle-resource-hidden.input';
import { ToggleResourceCartInput } from '../dto/toggle-resource-cart.input';
import { RequestResourcesInput } from '../dto/request-resources.input';

@Resolver(() => Resource)
export class ResourceResolver {
  constructor(private service: ResourceService) {}

  @Query(() => [Resource], { name: 'studentResources' })
  @UseGuards(new AuthGuard())
  get(
    @Args({ name: 'studentId', type: () => Int }) studentId: number,
    @Args({ name: 'schoolYearId', type: () => Int }) schoolYearId: number,
  ): Promise<Resource[]> {
    return this.service.find(studentId, schoolYearId);
  }

  @Mutation(() => Boolean)
  async toggleHiddenResource(
    @Args('toggleHiddenResourceInput')
    toggleHiddenResourceInput: ToggleHiddenResourceInput,
  ) {
    return this.service.toggleHiddenResource(toggleHiddenResourceInput);
  }

  @Mutation(() => Boolean)
  async toggleResourceCart(
    @Args('toggleResourceCartInput')
    toggleResourceCartInput: ToggleResourceCartInput,
  ) {
    return this.service.toggleResourceCart(toggleResourceCartInput);
  }

  @Mutation(() => Boolean)
  async requestResources(
    @Args('requestResourcesInput')
    requestResourcesInput: RequestResourcesInput,
  ) {
    return this.service.requestResources(requestResourcesInput);
  }
}
