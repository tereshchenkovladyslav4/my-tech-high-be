import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class assignStudentToSOEInput {
  @Field(() => [Int])
  student_ids: number[];

  @Field(() => Int)
  school_year_id: number;

  @Field(() => Int)
  school_partner_id: number;
}
