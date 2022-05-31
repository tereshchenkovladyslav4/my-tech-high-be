import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UserAnnouncementRequestParams {
  @Field(() => Number, { nullable: true })
  limit?: number = 10;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Number)
  user_id?: number;
}
