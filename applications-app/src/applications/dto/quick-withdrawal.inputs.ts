import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class QuickWithdrawalInput {
  @Field(() => [Int])
  withdrawal_ids: number[];

  @Field(() => Number)
  region_id: number;
}
