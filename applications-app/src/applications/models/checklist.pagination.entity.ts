import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Checklist } from './checklist.entity';

@ObjectType()
export class ChecklistPagination {
  @Field((type) => [Checklist])
  results?: Checklist[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
