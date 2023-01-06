import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EmailResourceRequestsInput {
  @Field(() => [Int])
  resourceRequestIds: number[];

  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;
}
