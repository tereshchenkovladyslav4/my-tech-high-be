import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ResourceRequestsActionInput {
  @Field(() => [Int])
  @IsInt()
  resourceRequestIds?: number[];
}
