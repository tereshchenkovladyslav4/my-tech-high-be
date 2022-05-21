import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => Int)
  @IsInt()
  UserId?: number;

  @Field(() => String)
  @IsIn(['Published', 'Scheduled', 'Draft'])
  status?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  sender?: string;

  @Field(() => Int)
  RegionId?: number;

  @Field(() => String)
  schedule_date?: string;

  @Field(() => String)
  schedule_time?: string;

  @Field(() => String)
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;

  @Field(() => String)
  cronJobTime?: string;
}
