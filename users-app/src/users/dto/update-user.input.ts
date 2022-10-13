import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  user_id: number;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  cookie?: string;

  @Field(() => Date, { nullable: true })
  last_login?: Date;

  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String, { nullable: true })
  red_announcements?: string;

  @Field(() => String, { nullable: true })
  red_notifications?: string;

  @Field(() => String, { nullable: true })
  auth_token?: string;

  @Field(() => String, { nullable: true })
  can_emulate?: string;

  @Field(() => String, { nullable: true })
  parent_email?: string;

  @Field(() => Int)
  @IsNotEmpty()
  creator_id?: number;

  @Field(() => Int)
  @IsNotEmpty()
  level?: number;

  @Field(() => [Int])
  @IsNotEmpty()
  regions?: [number];

  @Field(() => [Int])
  @IsNotEmpty()
  access?: [number];
}
