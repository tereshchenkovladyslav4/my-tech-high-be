import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, MaxLength, IsEmail, Length, IsInt } from 'class-validator';

@InputType()
export class CreatePersonInput {
  @Field({ nullable: true })
  @MaxLength(60)
  @Length(1, 60)
  first_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  middle_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @Length(1, 60)
  last_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  preferred_first_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  preferred_last_name?: string;

  @Field({ nullable: true })
  @MaxLength(10)
  @Length(4, 10)
  @IsOptional()
  gender?: string;

  @Field({nullable: true})
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsDate()
  date_of_birth?: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  user_id?: number;
}
