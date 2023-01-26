import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ReimbursementRequest } from '../models/reimbursement-request.entity';
import { ReimbursementRequestSearchInput } from '../dto/reimbursement-request-search.inputs';
import { ReimbursementRequestService } from '../services/reimbursement-request.service';
import { CreateOrUpdateReimbursementRequestInputs } from '../dto/create-or-update-reimbursement-request.inputs';

@Resolver(() => ReimbursementRequest)
export class ReimbursementRequestResolver {
  constructor(private service: ReimbursementRequestService) {}

  @Query(() => [ReimbursementRequest], { name: 'reimbursementRequests' })
  @UseGuards(new AuthGuard())
  getReimbursementRequests(@Args('param') param: ReimbursementRequestSearchInput): Promise<ReimbursementRequest[]> {
    return this.service.findByFilter(param);
  }

  @Mutation(() => ReimbursementRequest, { name: 'createOrUpdateReimbursementRequest' })
  @UseGuards(new AuthGuard())
  async createOrUpdateReimbursementRequest(
    @Args('requestInput') requestInput: CreateOrUpdateReimbursementRequestInputs,
  ): Promise<ReimbursementRequest> {
    return this.service.save(requestInput);
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
