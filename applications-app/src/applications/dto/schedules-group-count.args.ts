import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class SchedulesGroupCountArgs {
  @Field(() => Int)
  region_id: number;

  @Field(() => Int)
  school_year_id: number;
}
