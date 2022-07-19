import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WithdrawalStudentInfo {
  @Field(() => Int, { nullable: true })
  withdrawal_id?: number;

  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  school_of_enrollment?: string;
}
