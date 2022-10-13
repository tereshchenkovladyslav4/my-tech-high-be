import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserAccessInput {
  @Field(() => Int)
  user_id?: number;

  @Field(() => [Int])
  access_id?: [number];

  @Field(() => Int)
  creator_id?: number;
}
