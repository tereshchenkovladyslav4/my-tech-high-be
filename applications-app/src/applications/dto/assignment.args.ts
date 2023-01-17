import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class AssignmentArgs {
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
  sort = 'status|ASC';

  @Field(() => Int)
  @Min(1)
  @Max(100)
  masterId;

  @Field(() => AssignmentlistFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('AssignmentlistFilters')
export class AssignmentlistFilters {
  @Field(() => [String])
  status = [];

  @Field(() => Int)
  selectedYearId = null;
}
