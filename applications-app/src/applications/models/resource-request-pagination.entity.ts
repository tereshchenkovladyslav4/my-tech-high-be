import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ResourceRequest } from './resource-request.entity';

@ObjectType()
export class ResourceRequestPagination {
  @Field(() => [ResourceRequest])
  results?: ResourceRequest[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
