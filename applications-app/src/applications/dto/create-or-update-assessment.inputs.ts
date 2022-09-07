import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateAssessmentInput {
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

  @Field(() => String, { nullable: true })
  option1: string;

  @Field(() => String, { nullable: true })
  option_list: string;
}

@InputType()
export class UpdateAssessmentInputs {
  @Field((type) => [CreateOrUpdateAssessmentInput], { nullable: true })
  updateAssessments: CreateOrUpdateAssessmentInput[];
}
