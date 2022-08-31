import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChangeStatusInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => Int)
  school_year_id?: number;

  @Field(() => Int)
  status?: number;

  @Field(() => Int)
  packet_id?: number;
}
