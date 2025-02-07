import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ReimbursementReceiptsActionInput {
  @Field(() => [Int])
  @IsInt()
  receiptIds?: number[];
}
