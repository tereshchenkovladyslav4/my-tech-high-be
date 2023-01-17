import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MePermission {
  @Field(() => String)
  jwt?: string;

  @Field(() => Boolean)
  unverified?: boolean;
}
