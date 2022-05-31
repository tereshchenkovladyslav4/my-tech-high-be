import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UserAnnouncementInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field((type) => Int, { nullable: true })
  AnnouncementId: number | null;

  @Field((type) => Int, { nullable: true })
  user_id: number;

  @Field(() => String, { nullable: true })
  @IsIn(['Read', 'Unread'])
  status?: string;
}
