import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAccessInput {
  @Field(() => String)
  name?: string;

  @Field(() => Int)
  creator_id?: number;
}
