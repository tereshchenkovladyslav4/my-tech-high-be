import { Field, ArgsType, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
@ArgsType()
export class PaginationInput {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(1000)
  take = 25;

  @Field((type) => String)
  sort = '';
}
