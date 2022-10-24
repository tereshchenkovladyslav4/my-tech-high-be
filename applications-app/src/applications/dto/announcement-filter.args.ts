import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class AnnouncementFilterArgs {
  @Field(() => Int)
  RegionId?: number;

  @Field(() => String)
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;

  @Field(() => String, { nullable: true })
  filter_program_years?: string;

  @Field(() => String, { nullable: true })
  filter_school_partners?: string;

  @Field(() => String, { nullable: true })
  filter_others?: string;

  @Field(() => String)
  status?: 'Draft' | 'Scheduled' | 'Published' | 'Republished';
}

//AnnouncementEmailArgs
