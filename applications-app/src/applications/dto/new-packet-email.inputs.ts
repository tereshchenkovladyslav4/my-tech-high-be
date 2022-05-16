import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePacketEmailInput {
  @Field(() => String)
  subject?: string;

  @Field(() => Int)
  packet_id?: number;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  from_email?: string;
}
