import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Checklist } from '../models/checklist.entity';
import { ChecklistInput } from '../dto/checklist.inputs';
import { ChecklistService } from '../services/checklist.service';
import { Pagination } from 'src/paginate';
import { ChecklistsArgs } from '../dto/checklist.args';
import { ChecklistPagination } from '../models/checklist.pagination.entity';

@Resolver(() => Checklist)
export class ChecklistResolver {
  constructor(private service: ChecklistService) {}

  @Query(() => ChecklistPagination, { name: 'checklist' })
  async getChecklist(@Args() checklistArgs: ChecklistsArgs): Promise<Pagination<Checklist>> {
    const results = await this.service.findAll(checklistArgs);
    return results;
  }

  @Mutation(() => Boolean, { name: 'createNewChecklist' })
  @UseGuards(new AuthGuard())
  async createNewChecklist(
    @Args('createNewChecklistInput', { type: () => [ChecklistInput] })
    createNewChecklistInput: ChecklistInput[],
  ): Promise<boolean> {
    return this.service.save(createNewChecklistInput);
  }

  @Mutation(() => Boolean, { name: 'updateChecklistById' })
  @UseGuards(new AuthGuard())
  async updateChecklistById(
    @Args('updateChecklistInput')
    updateChecklistInput: ChecklistInput,
  ): Promise<boolean> {
    return this.service.update(updateChecklistInput);
  }
}
