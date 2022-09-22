import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateStudentAssessmentInput {
  @Field(() => Int, { nullable: true })
  assessment_option_id?: number;

  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Field(() => Int, { nullable: true })
  AssessmentId: number;

  @Field(() => Int, { nullable: true })
  OptionId: number;

  @Field(() => String, { nullable: true })
  out_text: string;
}
