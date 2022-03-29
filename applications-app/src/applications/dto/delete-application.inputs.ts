import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class DeleteApplicationInput {
  @Field(() => [String])
  @IsInt()
  application_ids?: string[];
}
