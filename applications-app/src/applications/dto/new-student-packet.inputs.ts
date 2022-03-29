import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, MaxLength, IsEmail, Length, IsInt } from 'class-validator';
import { CreateAddressInput } from './new-address.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class CreateStudentPacketInput extends CreateStudentPersonInput {
  @Field({ nullable: true })
  secondary_phone?: string;

  @Field({ nullable: true })
  secondary_email?: string;

  @Field((type) => CreateAddressInput)
  address?: CreateAddressInput;
}
