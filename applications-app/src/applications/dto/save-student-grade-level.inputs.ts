import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class SaveStudenGradeLeveltInput {
  @Field(() => Int)
  @IsInt()
  student_id?: number;

  @Field(() => Int)
  @IsInt()
  school_year_id?: number;

  @Field(() => String)
  @MaxLength(3)
  grade_level?: string
}
