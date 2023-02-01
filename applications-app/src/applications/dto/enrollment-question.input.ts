import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class EnrollmentQuestionsInput {
  @Field(() => Int)
  @IsNotEmpty()
  region_id?: number;

  @Field(() => String)
  @IsNotEmpty()
  school_year_id?: string;
}
