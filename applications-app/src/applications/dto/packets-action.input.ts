import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class PacketsActionInput {
  @Field(() => [Int])
  @IsInt()
  packetIds?: number[];
}
