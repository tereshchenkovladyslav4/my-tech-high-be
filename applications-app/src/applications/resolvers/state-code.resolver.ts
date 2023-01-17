import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { StateCodes } from '../models/state-codes.entity';
import { StateCodesService } from '../services/state-codes.service';
import { StateCodesInput } from '../dto/state-codes.input';
import { StateCodesArgs } from '../dto/state-codes.args';
import { Pagination } from 'src/paginate';
import { StateCodesPagination } from '../models/statecode.pagination.entity';

@Resolver(() => StateCodes)
export class StateCodesResolver {
  constructor(private service: StateCodesService) {}

  @Query(() => StateCodesPagination, { name: 'stateCodes' })
  async getChecklist(@Args() stateCodesArgs: StateCodesArgs): Promise<Pagination<StateCodes>> {
    const results = await this.service.findAll(stateCodesArgs);
    return results;
  }

  @Mutation(() => Boolean, { name: 'createStateCodes' })
  @UseGuards(new AuthGuard())
  async createOrUpdateStateCodes(
    @Args('createStateCodesInput', { type: () => [StateCodesInput] })
    createStateCodesInput: StateCodesInput[],
  ): Promise<boolean> {
    return this.service.save(createStateCodesInput);
  }

  @Mutation(() => Boolean, { name: 'updateStateCodesById' })
  @UseGuards(new AuthGuard())
  async updateStateCodesById(
    @Args('updateStateCodesInput')
    updateStateCodesInput: StateCodesInput,
  ): Promise<boolean> {
    return this.service.update(updateStateCodesInput);
  }
}
