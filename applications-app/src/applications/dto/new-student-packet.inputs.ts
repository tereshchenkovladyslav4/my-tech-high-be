import { Field, InputType } from '@nestjs/graphql';
import { CreateAddressInput } from './new-address.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';

@InputType()
export class CreateStudentPacketInput extends CreateStudentPersonInput {
  @Field({ nullable: true })
  address?: CreateAddressInput;

  @Field({ nullable: true })
  packet?: NewParentPacketContactInput;
}
