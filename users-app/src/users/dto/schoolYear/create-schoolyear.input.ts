import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSchoolYearInput {
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

  @Field(() => Int)
  @IsNotEmpty()
  RegionId?: number;
}
