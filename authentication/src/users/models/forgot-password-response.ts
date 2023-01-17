import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => Boolean)
  status?: boolean;

  @Field(() => Boolean)
  unverified?: boolean;
}
