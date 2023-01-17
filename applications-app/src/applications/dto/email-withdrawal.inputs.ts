import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EmailWithdrawalInput {
  @Field(() => [Int])
  withdrawal_ids: number[];

  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;

  @Field(() => Number)
  region_id: number;
}
