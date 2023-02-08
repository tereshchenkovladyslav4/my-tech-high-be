import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WithdrawQuestionInput {
  @Field(() => Number)
  regionId: number;

  @Field(() => String)
  section: string;

  @Field(() => Number, { nullable: true })
  school_year_id: number;

  @Field(() => Boolean, { nullable: true })
  mid_year: boolean;
}
