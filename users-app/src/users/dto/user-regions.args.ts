import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class UserRegionArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  take = 25;

  @Field(() => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field(() => String)
  sort = 'status|ASC';

  @Field(() => String)
  search = '';

  @Field(() => [String])
  filters: string[] = ['Parent', 'Student'];
}
