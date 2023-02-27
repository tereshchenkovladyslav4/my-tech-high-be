import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateResourceRequestInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  resource_level_id?: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  vendor?: string;

  @Field(() => String, { nullable: true })
  resource_level_name?: string;

  @Field(() => String, { nullable: true })
  created_at?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  student_id?: string;

  @Field(() => String, { nullable: true })
  student_first_name?: string;

  @Field(() => String, { nullable: true })
  student_last_name?: string;

  @Field(() => String, { nullable: true })
  student_email?: string;

  @Field(() => String, { nullable: true })
  grade_level?: string;

  @Field(() => String, { nullable: true })
  date_of_birth?: string;

  @Field(() => String, { nullable: true })
  parent_first_name?: string;

  @Field(() => String, { nullable: true })
  parent_last_name?: string;

  @Field(() => String, { nullable: true })
  parent_email?: string;

  @Field(() => String, { nullable: true })
  cost?: string;

  @Field(() => String, { nullable: true })
  returning_status?: string;

  @Field(() => String, { nullable: true })
  student_status?: string;
}
