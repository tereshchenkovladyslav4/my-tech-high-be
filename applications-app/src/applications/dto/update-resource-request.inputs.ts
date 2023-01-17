import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateResourceRequestInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  resource_id: number;

  @Field(() => Int, { nullable: true })
  resource_level_id?: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}
