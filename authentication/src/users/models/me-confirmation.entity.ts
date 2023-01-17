import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeConfirmation {
  @Field(() => String)
  token?: string;

  @Field(() => String)
  email?: string;

  @Field()
  status?: string;

  @Field()
  level?: number;
}
