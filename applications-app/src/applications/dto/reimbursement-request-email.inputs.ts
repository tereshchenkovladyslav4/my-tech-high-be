import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReimbursementRequestEmailInputs {
  @Field(() => Int)
  reimbursement_request_id?: number;

  @Field(() => Int)
  email_record_id?: number;

  @Field(() => String)
  from_email?: string;

  @Field(() => String)
  subject?: string;

  @Field(() => String)
  body?: string;
}
