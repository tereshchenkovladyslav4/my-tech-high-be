import { Field, InputType, Int } from '@nestjs/graphql';
import { ReimbursementFormType } from '../enums';

@InputType()
export class ReimbursementQuestionInput {
  @Field(() => Int, { nullable: true })
  reimbursement_question_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => Int, { nullable: true })
  type: number;

  @Field(() => String, { nullable: true })
  question: string;

  @Field(() => String, { nullable: true })
  options: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Int, { nullable: true })
  priority: number;

  @Field(() => Boolean, { nullable: true })
  required: boolean;

  @Field(() => String, { nullable: true })
  slug: string;

  @Field(() => Boolean, { nullable: true })
  default_question: boolean;

  @Field(() => ReimbursementFormType, { nullable: true })
  reimbursement_form_type: ReimbursementFormType;

  @Field(() => Boolean, { nullable: true })
  is_direct_order: boolean;

  @Field(() => Boolean, { nullable: true })
  sortable: boolean;

  @Field(() => Boolean, { nullable: true })
  display_for_admin: boolean;

  @Field(() => String, { nullable: true })
  additional_question: string;
}

@InputType()
export class CreateOrUpdateReimbursementQuestionsInput {
  @Field(() => [ReimbursementQuestionInput], { nullable: true })
  questions: ReimbursementQuestionInput[];
}
