import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AssignmentService } from '../services/assignment.service';
import { Assignment } from '../models/assignment.entity';
import { CreateNewAssignmentInput } from '../dto/create-new-assignment.input';
import { Pagination } from 'src/paginate';
import { AssignmentPagination } from '../models/assignment.pagination.entity';
import { AssignmentArgs } from '../dto/assignment.args';
import { TeacherAssignmentArgs } from '../dto/teacher-assignment.args';

@Resolver(() => Assignment)
export class AssignmentResolver {
  constructor(private service: AssignmentService) {}

  @Mutation(() => Assignment, { name: 'createNewAssignment' })
  @UseGuards(new AuthGuard())
  async createNewAssignment(
    @Args('createNewAssignmentInput', { type: () => CreateNewAssignmentInput })
    createNewAssignmentInput: CreateNewAssignmentInput,
  ): Promise<Assignment> {
    return this.service.save(createNewAssignmentInput);
  }

  @Mutation(() => Boolean, { name: 'updateNewAssignment' })
  @UseGuards(new AuthGuard())
  async updateNewAssignment(
    @Args('updateAssignmentInput', { type: () => CreateNewAssignmentInput })
    updateAssignmentInput: CreateNewAssignmentInput,
  ): Promise<boolean> {
    return this.service.update(updateAssignmentInput);
  }

  @Mutation(() => Boolean, { name: 'cloneAssignment' })
  @UseGuards(new AuthGuard())
  async cloneAssignment(
    @Args('cloneAssignmentInput', { type: () => CreateNewAssignmentInput })
    cloneAssignmentInput: CreateNewAssignmentInput,
  ): Promise<boolean> {
    return this.service.clone(cloneAssignmentInput);
  }

  @Query(() => AssignmentPagination, { name: 'getAssignmentsByMasterId' })
  async getChecklist(@Args() assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
    const results = await this.service.getAssignmentsByMasterId(assignmentArgs);
    return results;
  }

  @Query(() => Assignment, { name: 'getAssignmentById' })
  @UseGuards(new AuthGuard())
  async getMastersById(@Args('assignmentId', { type: () => Int }) assignmentId: number): Promise<Assignment> {
    return this.service.getById(assignmentId);
  }

  @Mutation(() => Boolean, { name: 'deleteAssignmentById' })
  @UseGuards(new AuthGuard())
  async deleteAssignmentById(@Args('assignmentId', { type: () => Int }) assignmentId: number): Promise<boolean> {
    return this.service.deleteById(assignmentId);
  }

  @Query(() => AssignmentPagination, { name: 'getTeacherAssignments' })
  async teacherAssignments(@Args() assignmentArgs: TeacherAssignmentArgs): Promise<Pagination<Assignment>> {
    return await this.service.findTeacherAssignment(assignmentArgs);
  }
}
