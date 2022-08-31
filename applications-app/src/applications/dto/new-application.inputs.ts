import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';
import { CreateAddressInput } from './new-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';
import { CreateStudentPacketInput } from './new-student-packet.inputs';

@InputType()
export class CreateApplicationInput {
  @Field(() => String)
  state?: string;

  @Field(() => Int)
  program_year?: number;

  @Field((type) => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field((type) => [CreateStudentPacketInput], { nullable: true })
  students?: CreateStudentPacketInput[];

  @Field({ nullable: true })
  referred_by?: string;

  @Field({ nullable: true })
  meta?: string;

  @Field({ nullable: true })
  packet?: NewParentPacketContactInput;

  @Field({ nullable: true })
  address?: CreateAddressInput;
  
  @Field(() => Boolean, { nullable: true })
  midyear_application: boolean;
}
