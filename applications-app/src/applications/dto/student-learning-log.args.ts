import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class StudentLearningLogArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(-1)
  @Max(50)
  take = 25;

  @Field(() => String)
  sort = 'ASC';

  @Field(() => String)
  search = '';

  @Field(() => StudentLearningLogFilter)
  filter = null;
}

@InputType('StudentLearningLogFilter')
export class StudentLearningLogFilter {
  @Field(() => Boolean)
  showAll = true;

  @Field(() => Int)
  school_year_id: number;

  @Field(() => Int)
  student_id: number;
}
