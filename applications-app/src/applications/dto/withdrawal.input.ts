import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { WithdrawalOption } from '../enums/withdrawal-option.enum';
import { Withdrawal } from '../models/withdrawal.entity';

@InputType()
export class WithdrawalInput {
  @Field(() => Withdrawal)
  withdrawal = null;

  @Field(() => Int)
  @IsIn([WithdrawalOption])
  withdrawalOption?: number = null;
}
