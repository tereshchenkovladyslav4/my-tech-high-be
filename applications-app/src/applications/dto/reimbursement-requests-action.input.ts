import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ReimbursementRequestsActionInput {
  @Field(() => [Int])
  @IsInt()
  reimbursementRequestIds?: number[];
}
