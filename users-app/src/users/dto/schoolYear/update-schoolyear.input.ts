import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ReduceFunds } from '../../../enums';

@InputType()
export class UpdateSchoolYearInput {
  @Field(() => Int)
  @IsNotEmpty()
  school_year_id?: number;

  @Field(() => String, { nullable: true })
  date_begin?: string;

  @Field(() => String, { nullable: true })
  date_end?: string;

  @Field(() => String, { nullable: true })
  date_reg_open?: string;

  @Field(() => String, { nullable: true })
  date_reg_close?: string;

  @Field(() => Number, { nullable: true })
  midyear_application?: number;

  @Field(() => String, { nullable: true })
  midyear_application_open?: string;

  @Field(() => String, { nullable: true })
  midyear_application_close?: string;

  @Field(() => String, { nullable: true })
  birth_date_cut?: string;

  @Field(() => Boolean, { nullable: true })
  special_ed?: boolean;

  @Field(() => String, { nullable: true })
  special_ed_options?: string;

  @Field(() => Boolean, { nullable: true })
  enrollment_packet?: boolean;

  @Field(() => String, { nullable: true })
  grades?: string;

  @Field(() => String, { nullable: true })
  testing_preference_title?: string;

  @Field(() => String, { nullable: true })
  testing_preference_description?: string;

  @Field(() => String, { nullable: true })
  opt_out_form_title?: string;

  @Field(() => String, { nullable: true })
  opt_out_form_description?: string;

  @Field(() => String, { nullable: true })
  direct_orders_technology_instructions?: string;

  @Field(() => String, { nullable: true })
  direct_orders_supplement_instructions?: string;

  @Field(() => String, { nullable: true })
  direct_orders_custom_built_instructions?: string;

  @Field(() => String, { nullable: true })
  reimbursements_technology_instructions?: string;

  @Field(() => String, { nullable: true })
  reimbursements_supplement_instructions?: string;

  @Field(() => String, { nullable: true })
  reimbursements_custom_built_instructions?: string;

  @Field(() => String, { nullable: true })
  reimbursements_third_party_instructions?: string;

  @Field(() => String, { nullable: true })
  reimbursements_required_software_instructions?: string;

  @Field(() => Boolean, { nullable: true })
  schedule?: boolean;

  @Field(() => Boolean, { nullable: true })
  diploma_seeking?: boolean;

  @Field(() => Boolean, { nullable: true })
  testing_preference?: boolean;

  @Field(() => String, { nullable: true })
  schedule_builder_open?: string;

  @Field(() => String, { nullable: true })
  schedule_builder_close?: string;

  @Field(() => String, { nullable: true })
  second_semester_open?: string;

  @Field(() => String, { nullable: true })
  second_semester_close?: string;

  @Field(() => String, { nullable: true })
  midyear_schedule_open?: string;

  @Field(() => String, { nullable: true })
  midyear_schedule_close?: string;

  @Field(() => String, { nullable: true })
  homeroom_resource_open?: string;

  @Field(() => String, { nullable: true })
  homeroom_resource_close?: string;

  @Field(() => Boolean, { nullable: true })
  learning_logs?: boolean;

  @Field(() => Boolean, { nullable: true })
  learning_logs_first_second_semesters?: boolean;

  @Field(() => ReduceFunds, { nullable: true })
  reimbursements?: ReduceFunds;

  @Field(() => Boolean, { nullable: true })
  require_software?: boolean;

  @Field(() => ReduceFunds, { nullable: true })
  direct_orders?: ReduceFunds;

  @Field(() => String, { nullable: true })
  direct_order_open?: string;

  @Field(() => String, { nullable: true })
  direct_order_close?: string;

  @Field(() => String, { nullable: true })
  reimbursement_open?: string;

  @Field(() => String, { nullable: true })
  reimbursement_close?: string;

  @Field(() => String, { nullable: true })
  custom_built_open?: string;

  @Field(() => String, { nullable: true })
  custom_built_close?: string;

  @Field(() => String, { nullable: true })
  require_software_open?: string;

  @Field(() => String, { nullable: true })
  require_software_close?: string;

  @Field(() => String, { nullable: true })
  third_party_open?: string;

  @Field(() => String, { nullable: true })
  third_party_close?: string;

  @Field(() => String, { nullable: true })
  mid_direct_order_open?: string;

  @Field(() => String, { nullable: true })
  mid_direct_order_close?: string;

  @Field(() => String, { nullable: true })
  mid_reimbursement_open?: string;

  @Field(() => String, { nullable: true })
  mid_reimbursement_close?: string;

  @Field(() => String, { nullable: true })
  mid_custom_built_open?: string;

  @Field(() => String, { nullable: true })
  mid_custom_built_close?: string;

  @Field(() => String, { nullable: true })
  mid_require_software_open?: string;

  @Field(() => String, { nullable: true })
  mid_require_software_close?: string;

  @Field(() => String, { nullable: true })
  mid_third_party_open?: string;

  @Field(() => String, { nullable: true })
  mid_third_party_close?: string;
}
