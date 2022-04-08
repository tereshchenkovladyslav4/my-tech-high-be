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
  program?: string;

  @Field(() => String, { nullable: true })
  state_logo?: string;

  @Field(() => Boolean, { nullable: true })
  special_ed?: boolean;

  @Field(() => String, { nullable: true })
  birth_date?: string;

  @Field(() => String, { nullable: true })
  grades?: string;
}
