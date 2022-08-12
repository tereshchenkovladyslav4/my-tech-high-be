import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class StudentsArgs {
  @Field(type => Int)
  @Min(0)
  skip = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field(type => String)
  sort = 'ASC';

  @Field(type => String)
  search = '';

  @Field(type => StudentFilters)
  filter = null;
}

@InputType('StudentFilters')
export class StudentFilters {
  @Field((type) => String)
  region_id = "";

  @Field((type) => Int)
  schoolYear = 1;

  @Field((type) => [String])
  grades = [];

  @Field((type) => [String])
  specialEd = [];

  @Field((type) => [String])
  status = [];
}
