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

  @Query((returns) => AssignmentPagination, { name: 'getAssignmentsByMasterId' })
  async getChecklist(@Args() assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
    const results = await this.service.getAssignmentsByMasterId(assignmentArgs);
    return results;
  }

  @Mutation((returns) => Boolean, { name: 'deleteAssignmentById' })
  @UseGuards(new AuthGuard())
  async deleteAssignmentById(@Args('assignmentId', { type: () => Int }) assignmentId: number): Promise<Boolean> {
    return this.service.deleteById(assignmentId);
  }

}
