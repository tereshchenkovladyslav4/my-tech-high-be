import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateWithdrawalInput } from '../dto/update-withdrawal.inputs';
import { AuthGuard } from '../guards/auth.guard';
import { WithdrawalResponse } from '../models/withdrawal-response';
import { Withdrawal } from '../models/withdrawal.entity';
import { WithdrawalService } from '../services/withdrawal.service';

@Resolver((of) => Withdrawal)
export class WithdrawalResolver {
  constructor(private withdrawalService: WithdrawalService) {}

  @Query((returns) => [WithdrawalResponse], { name: 'withdrawals' })
  @UseGuards(new AuthGuard())
  async getWithdrawals(
    @Args('region_id') region_id: number,
  ): Promise<WithdrawalResponse[]> {
    return this.withdrawalService.findAll(region_id);
  }

  @Mutation((returns) => Withdrawal, { name: 'createOrUpdateWithdrawal' })
  @UseGuards(new AuthGuard())
  async createOrUpdateWithdrawal(
    @Args('updateWithdrawalInput')
    updateWithdrawalInput: UpdateWithdrawalInput,
  ): Promise<Withdrawal> {
    return this.withdrawalService.update(updateWithdrawalInput);
  }

  @Mutation((returns) => Boolean, { name: 'deleteWithdrawal' })
  @UseGuards(new AuthGuard())
  async deleteWithdrawal(
    @Args('student_id')
    student_id: number,
  ): Promise<Boolean> {
    return this.withdrawalService.delete(student_id);
  }
}
