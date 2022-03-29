import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ApplicatinQuestionsInput {
  @Field(() => Int)
  @IsNotEmpty()
  region_id?: number;
}
