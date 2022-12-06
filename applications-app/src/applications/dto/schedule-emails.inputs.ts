import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateScheduleEmailInput {
  @Field(() => String)
  subject?: string;

  @Field(() => Int)
  schedule_id?: number;

  @Field(() => String)
  body?: string;

  @Field(() => String)
  from_email?: string;

  @Field(() => String)
  template_name?: string;
}
