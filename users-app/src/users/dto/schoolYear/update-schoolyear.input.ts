import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

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
}
