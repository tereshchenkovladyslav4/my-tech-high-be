import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReinstateWithdrawalInput {
  @Field(() => [Int])
  withdrawal_ids: number[];

  @Field(() => Int)
  reinstate_type: number;
}
