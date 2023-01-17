import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class StateCodesArgs {
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
  sort = 'stateCodeId|ASC';

  @Field(() => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field(() => StateCodesFilters)
  filter = null;

  @Field(() => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('StateCodesFilters')
export class StateCodesFilters {
  @Field(() => Int)
  selectedYearId = null;
}
