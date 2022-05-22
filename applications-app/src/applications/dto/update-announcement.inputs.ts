import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UpdateAnnouncementInput {
  @Field(() => Int)
  @IsInt()
  announcement_id?: number;

  @Field(() => String)
  @IsIn(['Published', 'Scheduled', 'Draft'])
  status?: string;

  @Field(() => String)
  posted_by?: string;

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
}
