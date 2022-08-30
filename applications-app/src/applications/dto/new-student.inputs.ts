import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field(() => Int)
  @IsInt()
  person_id?: number;

  @Field(() => Int)
  @IsInt()
  parent_id?: number;

  @Field(() => Int)
  @IsInt()
  special_ed?: number;

  @Field(() => String)
  grade_level?: string;
}
