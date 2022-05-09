import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class NewApplicationQuestionsInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  type: number;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  question: string;

  @Field(() => String, { nullable: true })
  options?: string;

  @Field(() => Boolean, { defaultValue: false })
  required?: boolean;

  @Field(() => Int)
  @IsNotEmpty()
  region_id?: number;

  @Field(() => Int, { defaultValue: 0 })
  validation?: number;

  @Field(() => Boolean, { defaultValue: false })
  student_question?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  default_question?: boolean;

  @Field(() => String)
  slug: string;
}
