import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Checklist } from './checklist.entity';

@ObjectType()
export class ChecklistPagination {
  @Field(() => [Checklist])
  results?: Checklist[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
