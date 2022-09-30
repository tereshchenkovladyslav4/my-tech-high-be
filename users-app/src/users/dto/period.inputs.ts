import { Field, InputType, Int } from '@nestjs/graphql';
import { REDUCE_FUNDS, SEMESTER_TYPE } from '../../enums/period.enum';
import { Min } from 'class-validator';

@InputType()
export class PeriodInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  school_year_id: number;

  @Field(() => Int)
  period: number;

  @Field(() => String)
  category: string;

  @Field(() => String)
  grade_level_min: string;

  @Field(() => String)
  grade_level_max: string;

  @Field(() => REDUCE_FUNDS, { nullable: true })
  reduce_funds: REDUCE_FUNDS;

  @Field(() => Int, { nullable: true })
  price: number;

  @Field(() => SEMESTER_TYPE, { nullable: true })
  semester: SEMESTER_TYPE;

  @Field({ nullable: true })
  message_semester?: string;

  @Field({ nullable: true })
  message_period?: string;

  @Field(() => Boolean, { nullable: true })
  notify_semester: boolean;

  @Field(() => Boolean, { nullable: true })
  notify_period: boolean;

  @Field(() => Boolean, { nullable: true })
  archived?: boolean;
}
