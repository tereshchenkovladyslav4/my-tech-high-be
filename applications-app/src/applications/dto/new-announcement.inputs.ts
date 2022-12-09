import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String)
  posted_by?: string;

  @Field(() => String)
  @IsIn(['Published', 'Scheduled', 'Draft'])
  status?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;

  @Field(() => Int)
  RegionId?: number;

  @Field(() => Date)
  schedule_time?: Date;

  @Field(() => String)
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;

  @Field(() => String)
  filter_others?: string;

  @Field(() => String)
  filter_providers?: string;

  @Field(() => Boolean, { nullable: true })
  isArchived?: boolean;

  @Field(() => String)
  filter_program_years: string;

  @Field(() => String)
  filter_school_partners: string;
}
