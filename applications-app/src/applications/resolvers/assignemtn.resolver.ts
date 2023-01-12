import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AssignmentService } from '../services/assignment.service';
import { Assignment } from '../models/assignment.entity';
import { CreateNewAssignmentInput } from '../dto/create-new-assignment.input';
import { Pagination } from 'src/paginate';
import { AssignmentPagination } from '../models/assignment.pagination.entity';
import { AssignmentArgs } from '../dto/assignment.args';

@Resolver((of) => Assignment)
export class AssignmentResolver {
  constructor(
    private service: AssignmentService,
  ) { }

  @Mutation((returns) => Assignment, { name: 'createNewAssignment' })
  @UseGuards(new AuthGuard())
  async createNewAssignment(
    @Args('createNewAssignmentInput', { type: () => CreateNewAssignmentInput })
    createNewAssignmentInput: CreateNewAssignmentInput,
  ): Promise<Assignment> {
    return this.service.save(createNewAssignmentInput);
  }

  @Mutation((returns) => Boolean, { name: 'updateNewAssignment' })
  @UseGuards(new AuthGuard())
  async updateNewAssignment(
    @Args('updateAssignmentInput', { type: () => CreateNewAssignmentInput })
    updateAssignmentInput: CreateNewAssignmentInput,
  ): Promise<Boolean> {
    return this.service.update(updateAssignmentInput);
  }

  @Query((returns) => AssignmentPagination, { name: 'getAssignmentsByMasterId' })
  async getChecklist(@Args() assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
    const results = await this.service.getAssignmentsByMasterId(assignmentArgs);
    return results;
  }

  @Query((returns) => Assignment, { name: 'getAssignmentById' })
  @UseGuards(new AuthGuard())
  async getMastersById(@Args('assignmentId', { type: () => Int }) assignmentId: number): Promise<Assignment> {
    return this.service.getById(assignmentId);
  }

  @Mutation((returns) => Boolean, { name: 'deleteAssignmentById' })
  @UseGuards(new AuthGuard())
  async deleteAssignmentById(@Args('assignmentId', { type: () => Int }) assignmentId: number): Promise<Boolean> {
    return this.service.deleteById(assignmentId);
  }

}
