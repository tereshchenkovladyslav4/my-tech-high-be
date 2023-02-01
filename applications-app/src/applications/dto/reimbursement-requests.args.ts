import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ReimbursementRequestsArgs {
  @Field(() => Int)
  schoolYearId: number;

  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(() => String)
  @Min(1)
  @Max(50)
  sort = 'created_at|asc';

  @Field(() => ReimbursementRequestFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('ReimbursementRequestFilters')
export class ReimbursementRequestFilters {
  @Field(() => [String])
  requests = [];

  @Field(() => [String])
  types = [];

  @Field(() => [String])
  others = [];

  @Field(() => [String])
  statuses = [];

  @Field(() => [String])
  grades = [];
}
