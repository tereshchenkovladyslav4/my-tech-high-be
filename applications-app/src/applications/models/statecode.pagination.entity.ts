import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { StateCodes } from './state-codes.entity';

@ObjectType()
export class StateCodesPagination {
  @Field((type) => [StateCodes])
  results?: StateCodes[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
