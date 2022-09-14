import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ToggleResourceCartInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => Int)
  resource_id?: number;

  @Field(() => Boolean)
  inCart?: boolean;

  @Field(() => Int, { nullable: true })
  resource_level_id?: number = null;

  @Field(() => Boolean)
  waitlist_confirmed?: boolean = false;
}
