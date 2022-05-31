import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@ObjectType()
export class UserAnnouncementResponse {
  @Field(() => Number)
  id?: number;

  @Field(() => Number)
  announcement_id?: number;

  @Field(() => Number)
  user_id?: number;

  @Field(() => String)
  sender?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;

  @Field(() => Int)
  RegionId?: number;

  @Field(() => String)
  status?: string;

  @Field(() => Date)
  date?: Date;

  @Field(() => String)
  filter_grades?: string;
}
