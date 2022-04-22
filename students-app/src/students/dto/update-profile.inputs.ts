import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class UpdateStudentProfileInput {
  @Field(() => Int)
  student_id?: number;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  preferred_first_name?: string;

  @Field({ nullable: true })
  @MaxLength(60)
  @IsOptional()
  preferred_last_name?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  testing_preference?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  password?: string;
}
