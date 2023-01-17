import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteRecordInput {
  @Field(() => [String])
  @IsInt()
  record_ids?: string[];
}
