import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class IndividualWithdrawalInput {
  @Field(() => Int)
  withdrawal_id: number;

  @Field(() => String)
  body: number;

  @Field(() => Int)
  type: number; // 0: Email Only, 1: Withdraw & Email

  @Field(() => Int)
  region_id: number; // 0: Email Only, 1: Withdraw & Email
}
