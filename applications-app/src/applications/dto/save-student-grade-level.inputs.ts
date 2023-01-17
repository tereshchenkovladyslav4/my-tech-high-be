import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class SaveStudenGradeLeveltInput {
  @Field(() => Int)
  @IsInt()
  student_id?: number;

  @Field(() => Int)
  @IsInt()
  school_year_id?: number;

  @Field(() => String)
  grade_level?: string;
}
