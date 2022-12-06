import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';

@ObjectType()
export class AssignmentPagination {
  @Field((type) => [Assignment])
  results?: Assignment[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
