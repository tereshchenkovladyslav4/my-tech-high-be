import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PersonInfo {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  parentId: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  role: string;
}
