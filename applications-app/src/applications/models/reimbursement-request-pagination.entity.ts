import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ReimbursementRequest } from './reimbursement-request.entity';

@ObjectType()
export class ReimbursementRequestPagination {
  @Field(() => [ReimbursementRequest])
  results?: ReimbursementRequest[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
