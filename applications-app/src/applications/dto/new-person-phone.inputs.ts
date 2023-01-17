import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreatePersonPhoneInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  phone_id?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  person_id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  number?: string;

  @Field({ nullable: true })
  ext?: string;
}
