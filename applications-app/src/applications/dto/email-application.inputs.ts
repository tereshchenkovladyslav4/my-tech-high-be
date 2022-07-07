import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class EmailApplicationInput {
  @Field(() => [Int])
  application_ids: number[];

  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;
}
