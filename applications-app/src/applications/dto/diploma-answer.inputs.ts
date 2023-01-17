import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DiplomaAnswerInput {
  @Field(() => Int)
  schoolYearId: number;

  @Field(() => Int)
  studentId: number;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => Int, { nullable: true })
  answer?: number;
}
