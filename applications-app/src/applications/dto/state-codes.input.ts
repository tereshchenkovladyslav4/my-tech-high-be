import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StateCodesInput {
  @Field(() => Int, { nullable: true })
  state_codes_id?: number;

  @Field(() => Int, { nullable: true })
  TitleId?: number;

  @Field(() => String, { nullable: true })
  title_name?: string;

  @Field(() => String, { nullable: true })
  state_code?: string;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => String, { nullable: true })
  teacher?: string;

  @Field(() => String, { nullable: true })
  subject?: string;
}
