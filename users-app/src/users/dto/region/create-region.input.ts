import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateRegionInput {
  @Field(() => String)
  name?: string;

  @Field(() => Int)
  creator_id?: number;
}
