import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class EmailWithdrawalInput {
  @Field(() => [Int])
  withdrawal_ids: number[];

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;

  @Field(() => Number)
  region_id: number;
}
