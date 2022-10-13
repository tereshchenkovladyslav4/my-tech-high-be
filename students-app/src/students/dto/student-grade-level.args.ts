import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class StudentGradeLevelsArgs {
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
  sort = 'ASC';
}
