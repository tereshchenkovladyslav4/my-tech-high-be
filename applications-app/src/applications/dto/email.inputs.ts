import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class EmailInput {
  @Field(() => String, { nullable: true })
  recipients?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  from?: string;

  @Field(() => String, { nullable: true })
  bcc?: string;
}
