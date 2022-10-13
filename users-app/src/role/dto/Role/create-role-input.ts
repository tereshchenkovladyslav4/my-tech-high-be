import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  name?: string;

  @Field(() => Int)
  @Min(1)
  @Max(16)
  level?: number;

  @Field(() => Int)
  creator_id?: number;
}
