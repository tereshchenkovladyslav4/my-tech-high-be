import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
export class ApplicationPagination {
  @Field(() => [Application])
  results?: Application[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
