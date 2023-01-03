import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength } from 'class-validator';

@InputType()
export class AcceptApplicationInput {
  @Field(() => [String])
  @IsInt()
  application_ids?: string[];

  @Field(() => Boolean, { nullable: true })
  fromAdmin?: boolean;
}
