import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MasqueradeInput {
  @Field()
  user_id: number;

  @Field()
  masquerade: boolean;
}
