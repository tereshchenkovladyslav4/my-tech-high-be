import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class AcceptApplicationInput {
  @Field(() => [String])
  @IsInt()
  application_ids?: string[];

  @Field(() => Boolean, { nullable: true })
  fromAdmin?: boolean;
}
