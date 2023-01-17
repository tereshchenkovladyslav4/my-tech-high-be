import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonAddressInput } from './new-student-person-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';

@InputType()
export class EnrollmentPacketContactInput {
  @Field(() => Int)
  student_id?: number;

  @Field(() => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field(() => NewParentPacketContactInput)
  packet?: NewParentPacketContactInput;

  @Field(() => CreateStudentPersonAddressInput)
  student?: CreateStudentPersonAddressInput;

  @Field({ nullable: true })
  school_year_id?: number;
}
