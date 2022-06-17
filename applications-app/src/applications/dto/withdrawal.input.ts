import { Field, InputType, Int } from '@nestjs/graphql';
import { Withdrawal } from '../models/withdrawal.entity';

@InputType()
export class WithdrawalInput {
	@Field((type) => Withdrawal)
	withdrawal = null;
}