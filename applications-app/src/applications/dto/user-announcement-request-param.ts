import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserAnnouncementRequestParams {
  @Field(() => Number, { nullable: true })
  limit?: number = 10;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Number)
  user_id?: number;
}
