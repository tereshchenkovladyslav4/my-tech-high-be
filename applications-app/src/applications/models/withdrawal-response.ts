import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Application } from './application.entity';

@ObjectType()
export class WithdrawalResponse {
  @Field(() => ID, { nullable: true })
  withdrawal_id?: number;

  @Field((type) => Int, { nullable: true })
  StudentId: number | null;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  soe?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  grade_level?: string;

  @Field(() => Boolean, { nullable: true })
  funding?: boolean;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => Date, { nullable: true })
  date_effective?: Date;

  @Field(() => Date, { nullable: true })
  date_emailed?: Date;
}
