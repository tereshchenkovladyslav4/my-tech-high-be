import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EmailUpdatesAllowedInput {
  @Field(() => Number)
  region_id: number;

  @Field(() => Number)
  student_id: number;

  @Field(() => Number)
  schedule_id: number;
}
