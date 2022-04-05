import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRegionInput {
  @Field(() => Int)
  @IsNotEmpty()
  id?: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  program?: string;
}
