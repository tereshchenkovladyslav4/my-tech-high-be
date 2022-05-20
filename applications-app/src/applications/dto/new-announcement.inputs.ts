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
  filter_grades?: string;

  @Field(() => String)
  filter_users?: string;
}
