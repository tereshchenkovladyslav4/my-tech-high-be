import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateSchoolYearInput {
  @Field(() => Int)
  @IsNotEmpty()
  school_year_id?: number;

  @Field(() => Date, { nullable: true })
  date_begin?: string;

  @Field(() => Date, { nullable: true })
  date_end?: string;

  @Field(() => Date, { nullable: true })
  date_reg_open?: string;

  @Field(() => Date, { nullable: true })
  date_reg_close?: string;

  @Field(() => Number, { nullable: true })
  midyear_application?: number;

  @Field(() => Date, { nullable: true })
  midyear_application_open?: string;

  @Field(() => Date, { nullable: true })
  midyear_application_close?: string;

  @Field(() => Date, { nullable: true })
  birth_date_cut?: string;

  @Field(() => Boolean, { nullable: true })
  special_ed?: boolean;

  @Field(() => Boolean, { nullable: true })
  enrollment_packet?: boolean;

  @Field(() => String, { nullable: true })
  grades?: string;
}
