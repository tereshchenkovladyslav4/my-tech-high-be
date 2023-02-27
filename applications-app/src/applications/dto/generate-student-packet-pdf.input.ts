import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StudentPacketPDFInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => Int)
  school_year_id: number;

  @Field(() => Boolean)
  mid_year = false;
}
