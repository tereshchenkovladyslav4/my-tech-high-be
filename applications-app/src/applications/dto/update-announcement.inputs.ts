import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UpdateAnnouncementInput {
  @Field(() => Int)
  @IsInt()
  announcement_id?: number;

  @Field(() => Int)
  @IsInt()
  UserId?: number;

  @Field(() => String)
  @IsIn(['Published', 'Scheduled', 'Draft'])
  status?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;
}
