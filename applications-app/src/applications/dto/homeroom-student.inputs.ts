import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class HomeroomStudentInput {
  @Field(() => [Int])
  studentIds: number[];

  @Field(() => Int)
  school_year_id: number;

  @Field(() => Int)
  teacher_id: number;

  @Field(() => String, { nullable: true })
  auto_grade: string;
}
