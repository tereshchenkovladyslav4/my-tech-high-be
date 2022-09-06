import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RequestResourcesInput {
  @Field(() => Int)
  student_id?: number;
}
