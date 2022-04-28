import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEmailTemplateInput {
  @Field((type) => EmailTemplate)
  emailTemplate = null;

  @Field(() => String, { nullable: true })
  category?: string;
}

@InputType('emailTemplate')
export class EmailTemplate {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  bcc?: string;

  @Field(() => String, { nullable: true })
  from?: string;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => String, { nullable: true })
  template_name?: string;

  @Field(() => String, { nullable: true })
  deadline?: string;

  @Field(() => String, { nullable: true })
  standard_responses?: string;

  @Field(() => [EmailTemplateReminder], { nullable: true })
  reminders?: EmailTemplateReminder[];
}

@InputType('emailTemplateReminder')
export class EmailTemplateReminder {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => String, { nullable: true })
  deadline?: string;
}
