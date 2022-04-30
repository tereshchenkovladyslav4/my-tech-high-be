import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateApplicationEmailInput {
  @Field(() => String)
  subject?: string;

  @Field(() => Int)
  application_id?: number;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  from_email?: string;
}
