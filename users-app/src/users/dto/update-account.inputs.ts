import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class UpdateAccountInput {
  @Field()
  oldpassword?: string;

  @Field()
  @MinLength(8)
  password?: string;
}
