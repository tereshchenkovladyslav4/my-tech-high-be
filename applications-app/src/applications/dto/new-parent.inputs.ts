import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateParentInput {
  @Field(() => Int)
  @IsInt()
  person_id?: number;
}
