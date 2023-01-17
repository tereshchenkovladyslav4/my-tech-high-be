import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class StudentsArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(() => String)
  sort = 'ASC';

  @Field(() => String)
  search = '';

  @Field(() => StudentFilters)
  filter = null;
}

@InputType('StudentFilters')
export class StudentFilters {
  @Field(() => String)
  region_id = '';

  @Field(() => Int)
  schoolYear = 1;

  @Field(() => [String])
  grades = [];

  @Field(() => [String])
  specialEd = [];

  @Field(() => [String])
  status = [];
}
