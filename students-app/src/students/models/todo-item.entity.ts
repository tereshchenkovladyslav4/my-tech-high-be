import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Student } from './student.entity';

export enum ToDoCategory {
  SUBMIT_ENROLLMENT_PACKET = 'SUBMIT_ENROLLMENT_PACKET',
  RESUBMIT_ENROLLMENT_PACKET = 'RESUBMIT_ENROLLMENT_PACKET',
  SUBMIT_SCHEDULE = 'SUBMIT_SCHEDULE',
  RESUBMIT_SCHEDULE = 'RESUBMIT_SCHEDULE',
  RESUBMIT_REIMBURSEMENT = 'RESUBMIT_REIMBURSEMENT',
  RESUBMIT_DIRECT_ORDER = 'RESUBMIT_DIRECT_ORDER',
  TESTING_PREFERNCE = 'TESTING_PREFERNCE',
  MISSING_LEARNING_LOG = 'MISSING_LEARNING_LOG',
  RESUBMIT_LEARNING_LOG = 'RESUBMIT_LEARNING_LOG',
  INTENT_TO_RE_ENROLL = 'INTENT_TO_RE_ENROLL',
  REQUEST_HOMEROOM_RESOURCES = 'REQUEST_HOMEROOM_RESOURCES',
  SUBMIT_WITHDRAW = 'SUBMIT_WITHDRAW',
  SUBMIT_SECOND_SEMESTER_SCHEDULE = 'SUBMIT_SECOND_SEMESTER_SCHEDULE',
  RESUBMIT_SECOND_SEMESTER_SCHEDULE = 'RESUBMIT_SECOND_SEMESTER_SCHEDULE',
}

@ObjectType()
export class ToDoItem {
  @Field(() => String, { nullable: true })
  category: ToDoCategory;

  @Field(() => String, { nullable: true })
  phrase: string;

  @Field(() => String, { nullable: true })
  button: string;

  @Field(() => String, { nullable: true })
  icon: string;

  @Field(() => Int, { nullable: true })
  dashboard: number;

  @Field(() => Int, { nullable: true })
  homeroom: number;

  @Field(() => [Student], { nullable: true })
  students?: Student[];
}
