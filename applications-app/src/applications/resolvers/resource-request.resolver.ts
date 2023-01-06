import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'src/paginate';
import { ResourceRequest } from '../models/resource-request.entity';
import { ResourceRequestService } from '../services/resource-request.service';
import { ResourceRequestsArgs } from '../dto/resource-requests.args';
import { ResourceRequestPagination } from '../models/resource-request-pagination.entity';
import { ResourceRequestsActionInput } from '../dto/resource-requests-action.input';
import { ResourceRequestEmail } from '../models/resource-request-email.entity';
import { EmailResourceRequestsInput } from '../dto/email-resource-requests.input';
import { UpdateResourceRequestInput } from '../dto/update-resource-request.inputs';

@Resolver(() => ResourceRequest)
export class ResourceRequestResolver {
  constructor(private service: ResourceRequestService) {}

  @Query(() => ResourceRequestPagination, { name: 'resourceRequests' })
  async getResourceRequests(@Args() resourceRequestsArgs: ResourceRequestsArgs): Promise<Pagination<ResourceRequest>> {
    return await this.service.find(resourceRequestsArgs);
  }

  @Mutation(() => Boolean, { name: 'acceptResourceRequests' })
  async acceptResourceRequests(
    @Args('resourceRequestsActionInput')
    resourceRequestsActionInput: ResourceRequestsActionInput,
  ): Promise<boolean> {
    return await this.service.acceptResourceRequests(resourceRequestsActionInput);
  }

  @Mutation(() => Boolean, { name: 'removeResourceRequests' })
  async removeResourceRequests(
    @Args('resourceRequestsActionInput')
    resourceRequestsActionInput: ResourceRequestsActionInput,
  ): Promise<boolean> {
    return await this.service.removeResourceRequests(resourceRequestsActionInput);
  }

  @Mutation(() => Boolean, { name: 'deleteResourceRequests' })
  async deleteResourceRequests(
    @Args('resourceRequestsActionInput')
    resourceRequestsActionInput: ResourceRequestsActionInput,
  ): Promise<boolean> {
    return await this.service.deleteResourceRequests(resourceRequestsActionInput);
  }

  @Mutation(() => [ResourceRequestEmail], { name: 'emailResourceRequests' })
  async emailResourceRequests(
    @Args('emailResourceRequestsInput') emailResourceRequestsInput: EmailResourceRequestsInput,
  ): Promise<ResourceRequestEmail[]> {
    return await this.service.sendEmail(emailResourceRequestsInput);
  }

  @Mutation(() => ResourceRequest, { name: 'updateResourceRequest' })
  async updateResourceRequest(
    @Args('updateResourceRequestInput') updateResourceRequestInput: UpdateResourceRequestInput,
  ): Promise<ResourceRequest> {
    return await this.service.save(updateResourceRequestInput);
  }
}
