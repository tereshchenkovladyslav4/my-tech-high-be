import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class DeleteRecordInput {
  @Field(() => [String])
  @IsInt()
  record_ids?: string[];
}
