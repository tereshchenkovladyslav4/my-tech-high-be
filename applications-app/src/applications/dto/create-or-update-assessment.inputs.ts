import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AssessmentInput {
  @Field(() => Int, { nullable: true })
  assessment_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => String, { nullable: true })
  test_name: string;

  @Field(() => String, { nullable: true })
  grades: string;

  @Field(() => String, { nullable: true })
  information: string;

  @Field(() => Int, { nullable: true })
  priority: number;

  @Field(() => Boolean, { nullable: true })
  is_archived: boolean;
}

@InputType()
export class AssessmentOptionInput {
  @Field(() => Int, { nullable: true })
  option_id: number;

  @Field(() => Int, { nullable: true })
  AssessmentId: number;

  @Field(() => String, { nullable: true })
  label: string;

  @Field(() => String, { nullable: true })
  method: string;

  @Field(() => Boolean, { nullable: true })
  require_reason: boolean;

  @Field(() => String, { nullable: true })
  reason: string;
}

@InputType()
export class CreateOrUpdateAssessmentInput {
  @Field(() => AssessmentInput, { nullable: true })
  assessment: AssessmentInput;

  @Field(() => [AssessmentOptionInput], { nullable: true })
  options: AssessmentOptionInput[];
}

@InputType()
export class UpdateAssessmentInputs {
  @Field((type) => [AssessmentInput], { nullable: true })
  updateAssessments: AssessmentInput[];
}
