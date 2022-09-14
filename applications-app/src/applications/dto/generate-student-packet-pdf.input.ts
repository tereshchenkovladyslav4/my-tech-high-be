import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StudentPacketPDFInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => Int)
  region_id: number;
}
