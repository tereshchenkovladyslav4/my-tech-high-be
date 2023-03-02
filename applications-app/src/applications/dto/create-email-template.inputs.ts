import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEmailTemplateInput {
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

  @Field(() => Int, { nullable: true })
  deadline?: number;

  @Field(() => String, { nullable: true })
  standard_responses?: string;

  @Field(() => String, { nullable: true })
  template?: string;

  @Field(() => String, { nullable: true })
  inserts?: string;

  @Field(() => Int, { nullable: true })
  region_id?: number;

  @Field(() => Int, { nullable: true })
  school_year_id?: number;
}
