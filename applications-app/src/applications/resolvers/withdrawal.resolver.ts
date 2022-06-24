import { Args, Context, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Withdrawal, WithdrawalPagination } from '../models/withdrawal.entity';
import { WithdrawalInput } from '../dto/withdrawal.input';
import { WithdrawalService } from '../services/withdrawal.service';
import { Pagination } from 'src/paginate';
import { PaginationInput } from '../dto/pagination.input';
import { FilterInput } from '../dto/filter.input';
import { ResponseDTO } from '../dto/response.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { WithdrawalEmail } from '../models/withdrawal-email.entity';
import { User } from 'aws-sdk/clients/budgets';
import { EmailWithdrawalInput } from '../dto/email-withdrawal.inputs';

@Resolver((of) => Withdrawal)
export class WithdrawalResolver {
  constructor(private service: WithdrawalService) {}

  @Query((returns) => WithdrawalPagination, { name: 'withdrawals' })
  @UseGuards(new AuthGuard())
  get(
    @Args() pagination: PaginationInput,
    @Args() filter: FilterInput,
  ): Promise<Pagination<Withdrawal>> {
    return this.service.find(pagination, filter);
  }

  @Query((returns) => ResponseDTO, { name: 'withdrawalCountsByStatus' })
  @UseGuards(new AuthGuard())
  getCountsByStatus(@Args() filter: FilterInput): Promise<ResponseDTO> {
    return this.service.getCountsByStatus(filter);
  }

  @Query((returns) => ResponseDTO, { name: 'withdrawalStatus' })
  @UseGuards(new AuthGuard())
  getWithdrawalStatus(@Args() filter: FilterInput): Promise<ResponseDTO> {
    return this.service.getStatus(filter);
  }

  @Mutation((returns) => Boolean, { name: 'saveWithdrawal' })
  async save(
    @Args('withdrawalInput')
    withdrawalInput: WithdrawalInput,
  ): Promise<boolean> {
    const { withdrawal } = withdrawalInput;
    return await this.service.save(withdrawal);
  }

  @Mutation((returns) => [WithdrawalEmail], { name: 'emailWithdrawal' })
  @UseGuards(new AuthGuard())
  async emailWithdrawal(
    @Args('emailWithdrawalInput') emailWithdrawalInput: EmailWithdrawalInput,
  ): Promise<WithdrawalEmail[]> {
    return await this.service.sendEmail(emailWithdrawalInput);
  }

  @Mutation((returns) => Boolean, { name: 'deleteWithdrawal' })
  @UseGuards(new AuthGuard())
  async deleteWithdrawal(
    @Args('student_id', {type: () => Int})
    student_id: number,
  ): Promise<Boolean> {
    return this.service.delete(student_id);
  }
}
