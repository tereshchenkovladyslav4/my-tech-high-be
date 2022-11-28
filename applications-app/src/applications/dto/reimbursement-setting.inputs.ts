import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReimbursementSettingInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  school_year_id: number | null;

  @Field(() => String, { nullable: true })
  information?: string;

  @Field(() => Number, { nullable: true })
  supplemental_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  supplemental_direct_order_forms?: number;

  @Field(() => Number, { nullable: true })
  technology_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  technology_direct_order_forms?: number;

  @Field(() => Number, { nullable: true })
  custom_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  custom_direct_order_forms?: number;

  @Field(() => Boolean, { nullable: true })
  is_merged_periods?: boolean;

  @Field(() => String, { nullable: true })
  merged_periods?: string;

  @Field(() => Number, { nullable: true })
  merged_periods_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  merged_periods_direct_order_forms?: number;

  @Field(() => Number, { nullable: true })
  third_party_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  require_software_reimbursements_forms?: number;

  @Field(() => Number, { nullable: true })
  max_receipts?: number;

  @Field(() => Boolean, { nullable: true })
  require_passing_grade?: boolean;

  @Field(() => Number, { nullable: true })
  min_grade_percentage?: number;

  @Field(() => Boolean, { nullable: true })
  allow_delete?: boolean;

  @Field(() => Boolean, { nullable: true })
  allow_submit_with_updates_required?: boolean;

  @Field(() => Boolean, { nullable: true })
  auto_delete_updates_required?: boolean;

  @Field(() => Number, { nullable: true })
  num_days_delete_updates_required?: number;

  @Field(() => Boolean, { nullable: true })
  display_remaining_funds?: boolean;

  @Field(() => String, { nullable: true })
  remaining_funds?: string;
}
