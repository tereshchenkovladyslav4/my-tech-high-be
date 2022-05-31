import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class AnnouncementEmailArgs {
  @Field(() => Number)
  announcement_id?: number;

  @Field(() => String)
  sender?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;

  @Field(() => Int)
  RegionId?: number;

  @Field(() => String)
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;
}
