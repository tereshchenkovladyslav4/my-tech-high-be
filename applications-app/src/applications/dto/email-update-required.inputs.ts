import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EmailUpdateRequiredInput {
  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;

  @Field(() => Number)
  region_id: number;

  @Field(() => Number)
  student_id: number;

  @Field(() => Number)
  schedule_id: number;
}
