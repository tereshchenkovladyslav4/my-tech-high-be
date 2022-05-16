import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsDate,
  MaxLength,
  IsEmail,
  Length,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateStudentPersonInput {
  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  first_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  middle_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
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

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsDate()
  date_of_birth?: Date;

  @Field({ nullable: true })
  @MaxLength(3)
  grade_level?: string;
}
