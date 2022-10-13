import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class UpdateRoleInput {
  @Field(() => Int)
  @IsNotEmpty()
  id?: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  @Min(1)
  @Max(16)
  level?: number;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  creator_id?: number;
}
