import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewEnrollmentQuestionsInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  group_id?: number;

  @Field(() => Int)
  type: number;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  question: string;

  @Field(() => String, { nullable: true })
  options?: string;

  @Field(() => String, { nullable: true })
  additional_question?: string;

  @Field(() => Boolean, { defaultValue: false })
  required?: boolean;

  @Field(() => Int, { defaultValue: 0 })
  validation?: number;

  @Field(() => Boolean, { defaultValue: false })
  display_admin?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  default_question?: boolean;

  @Field(() => String)
  slug: string;
}
