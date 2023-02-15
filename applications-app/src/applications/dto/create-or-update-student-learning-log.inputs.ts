import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateStudentLearningLogInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Field(() => Int, { nullable: true })
  AssignmentId: number;

  @Field(() => String, { nullable: true })
  status: string;

  @Field(() => String, { nullable: true })
  meta: string;

  @Field(() => Float, { nullable: true })
  grade: number | null;
}
