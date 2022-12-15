import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min, IsOptional } from 'class-validator';

@ArgsType()
export class StateCodesArgs {
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
  sort = 'stateCodeId|ASC';

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field((type) => StateCodesFilters)
  filter = null;

  @Field((type) => String)
  @Min(1)
  @Max(50)
  search = '';
}

@InputType('StateCodesFilters')
export class StateCodesFilters {
  @Field((type) => Int)
  selectedYearId = null;
}
