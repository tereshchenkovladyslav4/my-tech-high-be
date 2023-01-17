import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateLearningLogQuestionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  assignment_id?: number;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  question?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  parent_slug?: string;

  @Field(() => String, { nullable: true })
  options?: string;

  @Field(() => Boolean, { defaultValue: false })
  default_question?: boolean;

  @Field(() => String, { nullable: true })
  validations?: string;

  @Field(() => String, { nullable: true })
  grades?: string;

  @Field(() => Number)
  page?: number;

  @Field(() => Number)
  order?: number;
}
