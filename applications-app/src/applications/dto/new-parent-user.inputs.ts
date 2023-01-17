import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength, IsEmail, IsInt } from 'class-validator';

@InputType()
export class CreateParentUserInput {
  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  lastName?: string;

  @Field()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Int, { defaultValue: 2 })
  @IsInt()
  level?: number;

  @Field({ nullable: true })
  updateAt?: string;
}
