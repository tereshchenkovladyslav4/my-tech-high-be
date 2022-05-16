import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UpdateWithdrawalInput {
  @Field(() => Int)
  @IsInt()
  withdrawal_id?: number;

  @Field(() => Int, { nullable: true })
  StudentId?: number;

  @Field(() => String, { nullable: true })
  @IsIn(['Notified', 'Withdrawn', 'Requested'])
  status?: string;

  @Field(() => String, { nullable: true })
  soe?: string;

  @Field(() => Boolean, { nullable: true })
  funding?: boolean;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => Date, { nullable: true })
  date_effective?: Date;

  @Field(() => Date, { nullable: true })
  date_emailed?: Date;
}
