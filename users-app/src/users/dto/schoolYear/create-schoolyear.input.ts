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

  @Field(() => Int)
  @IsNotEmpty()
  RegionId?: number;

  @Field(() => Int)
  cloneSchoolYearId?: number;
}
