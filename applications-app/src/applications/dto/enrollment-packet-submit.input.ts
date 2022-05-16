import { Field, InputType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonAddressInput } from './new-student-person-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';

@InputType()
export class EnrollmentPacketSubmitInput {
  @Field()
  packet_id?: number;

  @Field(() => Int)
  student_id?: number;

  @Field((type) => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field((type) => NewParentPacketContactInput)
  packet?: NewParentPacketContactInput;

  @Field((type) => CreateStudentPersonAddressInput)
  student?: CreateStudentPersonAddressInput;

  @Field({ nullable: true })
  school_year_id?: number;

  @Field({ nullable: true })
  signature_file_id?: number;
}
