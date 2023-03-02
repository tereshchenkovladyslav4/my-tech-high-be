import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UpdateAnnouncementInput {
  @Field(() => Int)
  @IsInt()
  announcement_id?: number;

  @Field(() => String, { nullable: true })
  @IsIn(['Published', 'Scheduled', 'Draft'])
  status?: string;

  @Field(() => String, { nullable: true })
  posted_by?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => Int, { nullable: true })
  RegionId?: number;

  @Field(() => Date, { nullable: true })
  schedule_time?: Date;

  @Field(() => String, { nullable: true })
  filter_grades?: string;

  @Field(() => String, { nullable: true })
  filter_users?: string;

  @Field(() => Number, { nullable: true })
  isArchived?: number;

  @Field(() => String, { nullable: true })
  filter_program_years?: string;

  @Field(() => String, { nullable: true })
  filter_school_partners?: string;

  @Field(() => String, { nullable: true })
  filter_others?: string;

  @Field(() => String, { nullable: true })
  filter_providers?: string;
}
