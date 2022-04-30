import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class UpdateAccountInput {
  @Field()
  @MinLength(8)
  password?: string;

  @Field()
  @MinLength(8)
  confirm_password?: string;

  @Field()
  @MinLength(8)
  current_password?: string;
}
