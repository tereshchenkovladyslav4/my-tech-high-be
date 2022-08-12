import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ToggleHiddenResourceInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => Int)
  resource_id?: number;

  @Field(() => Boolean)
  hidden?: boolean;
}
