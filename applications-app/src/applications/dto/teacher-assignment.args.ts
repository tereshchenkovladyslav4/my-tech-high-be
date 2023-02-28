import { ArgsType, Field, Int, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class TeacherAssignmentArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(-1)
  @Max(50)
  take = 25;

  @Field(() => String)
  search = '';

  @Field(() => TeacherAssignmentFilter)
  filter = null;
}

@InputType('TeacherAssignmentFilter')
export class TeacherAssignmentFilter {
  @Field(() => String)
  status: string;

  @Field(() => Int)
  classId: number;
}
