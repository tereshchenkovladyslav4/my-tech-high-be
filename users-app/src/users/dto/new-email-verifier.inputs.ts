import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateEmailVerifierInput {
  @Field(() => Int)
  user_id?: number;

  @Field()
  @IsEmail()
  email?: string;

  @Field(() => Int, { defaultValue: 0 })
  verification_type?: number;
}
