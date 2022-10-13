import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EmailReminderInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => Int, { nullable: true })
  reminder?: number;

  @Field(() => Int, { nullable: true })
  email_template_id?: number;
}
