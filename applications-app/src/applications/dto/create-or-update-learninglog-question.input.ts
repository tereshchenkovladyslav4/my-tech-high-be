import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateLearningLogQuestionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  master_id?: number;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  question?: string;

  @Field(() => String, { nullable: true })
  options?: string;

  @Field(() => Boolean, { defaultValue: false })
  default_question: boolean;

  @Field(() => Boolean, { defaultValue: false })
  custom_question: boolean;

  @Field(() => Boolean, { defaultValue: false })
  required: boolean;

  @Field(() => Boolean, { defaultValue: false })
  can_upload: boolean;
}
