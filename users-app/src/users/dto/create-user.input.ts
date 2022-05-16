import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  first_name?: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  last_name?: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => Int, { defaultValue: 15 })
  @IsNotEmpty()
  level: number;

  @Field(() => [Int])
  @IsNotEmpty()
  regions: [number];

  @Field(() => [Int])
  @IsNotEmpty()
  access: [number];

  @Field(() => Int)
  @IsNotEmpty()
  creator_id: number;

  @Field(() => String)
  parent_email?: string;
}
