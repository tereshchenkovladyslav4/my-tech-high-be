import { Args, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'src/paginate';
import { ResourceRequest } from '../models/resource-request.entity';
import { ResourceRequestService } from '../services/resource-request.service';
import { ResourceRequestsArgs } from '../dto/resource-requests.args';
import { ResourceRequestPagination } from '../models/resource-request-pagination.entity';

@Resolver(() => ResourceRequest)
export class ResourceRequestResolver {
  constructor(private service: ResourceRequestService) {}

  @Query(() => ResourceRequestPagination, { name: 'resourceRequests' })
  async getResourceRequests(@Args() resourceRequestsArgs: ResourceRequestsArgs): Promise<Pagination<ResourceRequest>> {
    return await this.service.find(resourceRequestsArgs);
  }
}
