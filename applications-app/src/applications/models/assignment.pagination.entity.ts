import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';

@ObjectType()
export class AssignmentPagination {
  @Field(() => [Assignment])
  results?: Assignment[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
