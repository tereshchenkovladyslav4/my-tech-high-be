import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateParentUserInput {
  @Field(() => Int)
  user_id?: number;

  @Field(() => String)
  parent_email?: string;
}
