import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { NewEnrollmentQuestionGroupInput } from './new-enrollment-question-group.inputs';

@InputType()
export class NewEnrollmentQuestionTabInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Boolean, { defaultValue: false })
  is_active?: boolean;

  @Field(() => String)
  tab_name: string;

  @Field(() => [NewEnrollmentQuestionGroupInput], { defaultValue: [] })
  groups?: NewEnrollmentQuestionGroupInput[];

  @Field(() => Int)
  @IsNotEmpty()
  region_id?: number;

  @Field(() => Int)
  school_year_id?: number;

  @Field(() => Boolean)
  mid_year?: boolean;
}
