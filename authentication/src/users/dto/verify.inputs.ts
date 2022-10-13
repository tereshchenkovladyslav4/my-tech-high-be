import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class VerifyInput {
  @Field()
  token?: string;

  @Field()
  @Length(6, 12)
  password?: string;
}
