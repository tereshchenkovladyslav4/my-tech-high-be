import { Field, InputType } from '@nestjs/graphql';
import { User } from '../models/user.entity';

@InputType()
export class AnnouncementEmailArgs {
  @Field(() => Number)
  announcementId?: number;

  @Field(() => String)
  sender: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;

  @Field(() => User)
  user: User;
}
