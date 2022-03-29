import { Parent, ResolveField, Resolver, Query, Context } from '@nestjs/graphql';
import { User } from '../models/user.entity';
import { StudentsService } from '../services/students.service';
import { Student } from '../models/student.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ParentToDo } from '../models/parent-todo.entity';
import { ToDoItem } from '../models/todo-item.entity';
import { ParentToDosService } from '../services/parent-todos.service';

@Resolver((of) => ParentToDo)
export class ParentToDosResolver {
  constructor(
      private readonly studentsService: StudentsService,
      private readonly parentToDosService: ParentToDosService,
    ) {}

  @Query((returns) => ParentToDo)
  @UseGuards(new AuthGuard())
  parent_todos(@Context('user') user: User) {
    return user;
  }

  @ResolveField((of) => ToDoItem, { name: 'submit_enrollment_packet' })
  public async getSubmitEnrollmentPacket(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitEnrollmentPacket(user);
  }
  
  @ResolveField((of) => ToDoItem, { name: 'resubmit_enrollment_packet' })
  public async getResubmitEnrollmentPacket(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitEnrollmentPacket(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'submit_schedule' })
  public async getSubmitSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.submitSchedule(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'resubmit_schedule' })
  public async getResubmitSchedule(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitSchedule(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'resubmit_direct_order' })
  public async getResubmitDirectOrder(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitDirectOrder(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'resubmit_reimbersement' })
  public async getResubmitReimbersement(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitReimbursement(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'missing_learning_log' })
  public async getMissingLearningLog(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.missingLearningLog(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'resubmit_learning_log' })
  public async getResubmitLearningLog(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.resubmitLearningLog(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'submit_testing_preference' })
  public async getSubmitTestingPreference(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.testingPrefernce(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'submit_intent_to_reenroll' })
  public async getSubmitIntentToEnroll(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.intentToReenroll(user);
  }

  @ResolveField((of) => ToDoItem, { name: 'request_homeroom_resources' })
  public async getRequestHomeroomResources(@Parent() user: User): Promise<ToDoItem> {
    return this.parentToDosService.requestHomeroomResources(user);
  }
}
