import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ResourceRequestEmailInputs {
  @Field(() => Int)
  resource_request_id?: number;

  @Field(() => Int)
  email_record_id?: number;

  @Field(() => String)
  from_email?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;
}
