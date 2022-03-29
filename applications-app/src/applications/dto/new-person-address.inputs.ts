import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength, Length, IsInt, Min } from 'class-validator';

@InputType()
export class CreatePersonAddressInput {
  @Field(() => Int)
  @IsInt()
  person_id?: number;

  @Field(() => Int)
  address_id?: number;
}
