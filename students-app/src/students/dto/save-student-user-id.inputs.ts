import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class SavePersonUserIdInput {
  @Field(() => Int)
  @IsInt()
  person_id?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  user_id?: number;
}
