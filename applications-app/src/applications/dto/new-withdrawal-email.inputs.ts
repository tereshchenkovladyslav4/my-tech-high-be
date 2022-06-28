import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateWithdrawalEmailInput {
  @Field(() => String)
  subject?: string;

  @Field(() => Int)
  withdrawal_id?: number;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  from_email?: string;

  @Field(() => Date, { nullable: true })
  created_at?: Date;
}
