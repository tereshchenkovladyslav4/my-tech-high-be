import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EmailScheduleInput {
  @Field(() => [Int])
  schedule_ids: number[];

  @Field(() => [String])
  schedule_status: string[];

  @Field(() => String)
  from: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  body: string;

  @Field(() => Number, { nullable: true })
  region_id?: number;
}
