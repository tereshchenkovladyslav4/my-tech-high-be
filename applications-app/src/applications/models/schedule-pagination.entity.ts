import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Schedule } from './schedule.entity';

@ObjectType()
export class SchedulePagination {
  @Field(() => [Schedule])
  results?: Schedule[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
