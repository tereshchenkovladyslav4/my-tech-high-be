import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Schedule } from './schedule.entity';

@ObjectType()
export class SchedulePagination {
  @Field((type) => [Schedule])
  results?: Schedule[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}