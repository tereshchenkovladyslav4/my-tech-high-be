import { Field, InputType, Int } from '@nestjs/graphql';


@InputType()
export class UpdateWithdrawalInput {
  @Field(() => Int)
  withdrawal_id: number;

  @Field(() => String, { nullable: true })
  field: string;

  @Field(() => String, { nullable: true })
  value: string;
}
