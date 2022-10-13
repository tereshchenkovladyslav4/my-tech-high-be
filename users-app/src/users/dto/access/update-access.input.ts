import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateAccessInput {
  @Field(() => Int)
  @IsNotEmpty()
  id?: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  creator_id?: number;
}
