import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min, IsOptional, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class UserRegionArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  take = 25;

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  region_id = 0;

  @Field((type) => String)
  sort = 'status|ASC';

  @Field((type) => String)
  search = '';

  @Field((type) => [String])
  filters: string[] = ['Parent', 'Student'];
}
