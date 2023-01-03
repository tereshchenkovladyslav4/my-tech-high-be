import { Parent, ResolveField, Resolver, Query, Context } from '@nestjs/graphql';
import { User } from '../models/user.entity';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ParentToDo } from '../models/parent-todo.entity';
import { ToDoItem } from '../models/todo-item.entity';
import { ParentToDosService } from '../services/parent-todos.service';
import { UsersService } from '../services/users.service';

@Resolver(() => ParentToDo)
export class ParentToDosResolver {
  constructor(private readonly parentToDosService: ParentToDosService, private readonly usersService: UsersService) {}

  @Query(() => ParentToDo)
  @UseGuards(new AuthGuard())
  async parent_todos(@Context('user') user: any) {
    if (user) {
      return await this.usersService.findOneByEmail(user.username);
    } else {
      throw new UnauthorizedException();
    }
  }

  @ResolveField(() => ToDoItem, { name: 'submit_enrollment_packet' })
  public async getSubmitEnrollmentPacket(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitEnrollmentPacket(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_enrollment_packet' })
  public async getResubmitEnrollmentPacket(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitEnrollmentPacket(user);
  }

  @ResolveField(() => ToDoItem, { name: 'submit_schedule' })
  public async getSubmitSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitSchedule(user);
  }

  @ResolveField(() => ToDoItem, { name: 'submit_second_semester_schedule' })
  public async getSubmitSecondSemesterSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitSecondSemesterSchedule(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_schedule' })
  public async getResubmitSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitSchedule(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_second_semester_schedule' })
  public async getResubmitSecondSemesterSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitSecondSemesterSchedule(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_direct_order' })
  public async getResubmitDirectOrder(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitDirectOrder(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_reimbersement' })
  public async getResubmitReimbersement(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitReimbursement(user);
  }

  @ResolveField(() => ToDoItem, { name: 'missing_learning_log' })
  public async getMissingLearningLog(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.missingLearningLog(user);
  }

  @ResolveField(() => ToDoItem, { name: 'resubmit_learning_log' })
  public async getResubmitLearningLog(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitLearningLog(user);
  }

  @ResolveField(() => ToDoItem, { name: 'submit_testing_preference' })
  public async getSubmitTestingPreference(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.testingPreference(user);
  }

  @ResolveField(() => ToDoItem, { name: 'submit_intent_to_reenroll' })
  public async getSubmitIntentToEnroll(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.intentToReEnroll(user);
  }

  @ResolveField(() => ToDoItem, { name: 'request_homeroom_resources' })
  public async getRequestHomeroomResources(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.requestHomeroomResources(user);
  }

  @ResolveField(() => ToDoItem, { name: 'submit_withdraws' })
  public async getSubmitWithdraws(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitWithdraws(user);
  }
}
