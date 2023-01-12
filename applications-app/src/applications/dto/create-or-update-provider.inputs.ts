import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateProviderInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  school_year_id: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  is_display: boolean;

  @Field(() => String, { nullable: true })
  reduce_funds?: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  reduce_funds_notification: string;

  @Field(() => Boolean, { nullable: true })
  multiple_periods: boolean;

  @Field(() => String, { nullable: true })
  multi_periods_notification: string;

  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Field(() => String, { nullable: true })
  periods: string;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @Field(() => Int, { nullable: true })
  priority: number | null;
}
