import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Withdrawal, WithdrawalPagination } from '../models/withdrawal.entity';
import { WithdrawalInput } from '../dto/withdrawal.input';
import { WithdrawalService } from '../services/withdrawal.service';
import { Pagination } from 'src/paginate';
import { PaginationInput } from '../dto/pagination.input';
import { FilterInput } from '../dto/filter.input';
import { ResponseDTO } from '../dto/response.dto';

@Resolver((of) => Withdrawal)
export class WithdrawalResolver {
	constructor(private service: WithdrawalService) {}

	@Query((returns) => WithdrawalPagination, { name: 'withdrawals' })
	get(
		@Args() pagination: PaginationInput,
		@Args() filter: FilterInput
	): Promise<Pagination<Withdrawal>> {
		return this.service.find(pagination, filter);
	}

	@Query((returns) => ResponseDTO, { name: 'withdrawalCountsByStatus' })
	getCountsByStatus(
		@Args() filter: FilterInput
	): Promise<ResponseDTO> {
		return this.service.getCountsByStatus(filter);
	}

	@Mutation((returns) => Boolean, { name: 'saveWithdrawal' })
	async save(
		@Args('withdrawalInput')
		withdrawalInput: WithdrawalInput,
	): Promise<boolean> {
		const { withdrawal } = withdrawalInput;
		const response = await this.service.save(
			withdrawal,
		);
		return true;
	}

	/*@Mutation((of) => Withdrawal, { name: 'removeWithdrawal' })
	async removeWithdrawal(
		@Args({ name: 'id', type: () => ID }) id: number,
	): Promise<boolean> {
		const withdrawal = await this.service.findById(id);
		if (!withdrawal) throw new BadRequestException();

		return await this.service.delete(id);
	}*/
}
