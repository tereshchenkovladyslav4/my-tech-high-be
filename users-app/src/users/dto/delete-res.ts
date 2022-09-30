import { Field, ObjectType, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class DeleteRes {
  @Field(() => Int, { nullable: true })
  affected?: number;
}
