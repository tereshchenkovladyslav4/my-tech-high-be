import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType()
export class UserAnnouncementInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  AnnouncementId: number | null;

  @Field(() => Int, { nullable: true })
  user_id: number;

  @Field(() => String, { nullable: true })
  @IsIn(['Read', 'Unread'])
  status?: string;

  @Field(() => Boolean, { nullable: true })
  emailed?: boolean;
}
