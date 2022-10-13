import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, MaxLength, IsEmail, Length, IsInt } from 'class-validator';
import { CreatePersonPhoneInput } from './new-person-phone.inputs';
import { UpdateAddressInput } from './update-address.inputs';
import { UpdatePersonInput } from './update-person.inputs';
@InputType()
export class UpdatePersonAddressInput {
  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field(() => Int, { nullable: true })
  observer_id?: number;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field({ nullable: true })
  person?: UpdatePersonInput;

  @Field({ nullable: true })
  address?: UpdateAddressInput;

  @Field({ nullable: true })
  phone?: CreatePersonPhoneInput;
}
