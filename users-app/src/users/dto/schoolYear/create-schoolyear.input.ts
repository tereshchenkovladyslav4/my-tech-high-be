import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSchoolYearInput {
  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  date_begin?: string;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  date_end?: string;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  date_reg_open?: string;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  date_reg_close?: string;

  @Field(() => Number, { nullable: true })
  midyear_application?: number;

  @Field(() => Date, { nullable: true })
  midyear_application_open?: string;

  @Field(() => Date, { nullable: true })
  midyear_application_close?: string;

  @Field(() => Date, { nullable: true })
  homeroom_resource_open?: string;

  @Field(() => Date, { nullable: true })
  homeroom_resource_close?: string;

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

  @Field(() => Int)
  @IsNotEmpty()
  RegionId?: number;

  @Field(() => Int)
  cloneSchoolYearId?: number;
}
