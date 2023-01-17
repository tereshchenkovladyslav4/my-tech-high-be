import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class DeleteRes {
  @Field(() => Int, { nullable: true })
  affected?: number;
}
