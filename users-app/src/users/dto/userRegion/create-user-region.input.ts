import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserRegionInput {
  @Field(() => Int)
  user_id?: number;

  @Field(() => [Int])
  region_id?: [number];

  @Field(() => Int)
  creator_id?: number;
}
