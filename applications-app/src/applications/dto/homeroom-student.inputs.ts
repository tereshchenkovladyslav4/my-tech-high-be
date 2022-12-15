import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class HomeroomStudentInput {
  @Field((type) => [Int])
  studentIds: number[];

  @Field((type) => Int)
  school_year_id: number;

  @Field((type) => Int)
  teacher_id: number;

  @Field((type) => String, { nullable: true })
  auto_grade: string;
}
