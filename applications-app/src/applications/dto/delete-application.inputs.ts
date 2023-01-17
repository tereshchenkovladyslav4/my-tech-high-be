import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteApplicationInput {
  @Field(() => [String])
  @IsInt()
  application_ids?: string[];
}
