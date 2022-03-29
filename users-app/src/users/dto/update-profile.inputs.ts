import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, MaxLength, Length, IsDate, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class UpdateProfileInput {
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

  @Field({nullable: true})
  @IsEmail()
  email?: string;

  @Field({nullable: true})
  phone_number?: string;

  @Field({nullable: true})
  is_can_receive_text_msg?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address_1?: string;

  @Field({ nullable: true })
  address_2?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  zipcode?: string;
}