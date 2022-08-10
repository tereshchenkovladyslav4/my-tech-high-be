import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEmailRecordInput {
  @Field(() => String)
  subject?: string;

  @Field(() => String)
  to_email?: string;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  from_email?: string;

  @Field(() => String)
  bcc?: string;

  @Field(() => String)
  template_name?: string;

  @Field(() => Int)
  region_id?: number;

  @Field(() => String)
  status?: string;
}
