import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class MasqueradeInput {
  @Field()
  user_id: number;

  @Field()
  masquerade: boolean;
}
