import { Field, ObjectType, Int } from '@nestjs/graphql';
import { StateCodes } from './state-codes.entity';

@ObjectType()
export class StateCodesPagination {
  @Field(() => [StateCodes])
  results?: StateCodes[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
