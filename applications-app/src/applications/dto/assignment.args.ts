import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class AssignmentArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  sort = 'status|ASC';

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  masterId;

  @Field((type) => AssignmentlistFilters)
  filter = null;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('AssignmentlistFilters')
export class AssignmentlistFilters {
  @Field((type) => [String])
  status = [];

  @Field((type) => Int)
  selectedYearId = null;
}
