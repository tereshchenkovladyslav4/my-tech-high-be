import { Field, Int, ObjectType, Directive } from '@nestjs/graphql';
import { Student } from './student.entity';
import { ToDoItem } from './todo-item.entity';

@ObjectType()
@Directive('@key(fields: "user_id")')
export class ParentToDo {
  @Field(() => Int)
  user_id?: number;

  @Field((type) => ToDoItem)
  submit_enrollment_packet?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_enrollment_packet?: ToDoItem;

  @Field((type) => ToDoItem)
  submit_schedule?: ToDoItem;

  @Field((type) => ToDoItem)
  submit_second_semester_schedule?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_schedule?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_second_semester_schedule?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_direct_order?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_reimbersement?: ToDoItem;

  @Field((type) => ToDoItem)
  missing_learning_log?: ToDoItem;

  @Field((type) => ToDoItem)
  resubmit_learning_log?: ToDoItem;

  @Field((type) => ToDoItem)
  submit_testing_preference?: ToDoItem;

  @Field((type) => ToDoItem)
  submit_intent_to_reenroll?: ToDoItem;

  @Field((type) => ToDoItem)
  request_homeroom_resources?: ToDoItem;

  @Field((type) => ToDoItem)
  submit_withdraws?: ToDoItem;
}
