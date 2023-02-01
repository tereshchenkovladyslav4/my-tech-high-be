import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ReimbursementRequest } from '../models/reimbursement-request.entity';
import { ReimbursementRequestSearchInput } from '../dto/reimbursement-request-search.inputs';
import { ReimbursementRequestService } from '../services/reimbursement-request.service';
import { CreateOrUpdateReimbursementRequestInputs } from '../dto/create-or-update-reimbursement-request.inputs';
import { Pagination } from '../../paginate';
import { ReimbursementRequestPagination } from '../models/reimbursement-request-pagination.entity';
import { ReimbursementRequestsArgs } from '../dto/reimbursement-requests.args';
import { ReimbursementReceipt } from '../models/reimbursement-receipt.entity';
import { CreateOrUpdateReimbursementReceiptInput } from '../dto/create-or-update-reimbursement-receipt.input';

@Resolver(() => ReimbursementRequest)
export class ReimbursementRequestResolver {
  constructor(private service: ReimbursementRequestService) {}

  @Query(() => ReimbursementRequestPagination, { name: 'reimbursementRequests' })
  async getReimbursementRequests(@Args() params: ReimbursementRequestsArgs): Promise<Pagination<ReimbursementRequest>> {
    return await this.service.find(params);
  }

  @Query(() => [ReimbursementRequest], { name: 'reimbursementRequestsForStudents' })
  @UseGuards(new AuthGuard())
  getReimbursementRequestsForStudents(
    @Args('param') param: ReimbursementRequestSearchInput,
  ): Promise<ReimbursementRequest[]> {
    return this.service.findForStudents(param);
  }

  @Mutation(() => ReimbursementRequest, { name: 'createOrUpdateReimbursementRequest' })
  @UseGuards(new AuthGuard())
  async createOrUpdateReimbursementRequest(
    @Args('requestInput') requestInput: CreateOrUpdateReimbursementRequestInputs,
  ): Promise<ReimbursementRequest> {
    return this.service.save(requestInput);
  }

  @Mutation(() => [ReimbursementReceipt], { name: 'createOrUpdateReimbursementReceipts' })
  @UseGuards(new AuthGuard())
  async createOrUpdateReimbursementReceipts(
    @Args('requestInput') requestInput: CreateOrUpdateReimbursementReceiptInput,
  ): Promise<ReimbursementReceipt[]> {
    return this.service.saveReceipts(requestInput);
  }

  @Mutation(() => Boolean, { name: 'deleteReimbursementRequest' })
  @UseGuards(new AuthGuard())
  async deleteReimbursementRequest(
    @Args('remimbursement_request_id')
    remimbursement_request_id: number,
  ): Promise<boolean> {
    return this.service.delete(remimbursement_request_id);
  }
}
