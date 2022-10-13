import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
export class ApplicationPagination {
  @Field((type) => [Application])
  results?: Application[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
