import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonAddressInput } from './new-student-person-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';

@InputType()
export class EnrollmentPacketContactInput {
  @Field(() => Int)
  student_id?: number;

  @Field((type) => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field((type) => NewParentPacketContactInput)
  packet?: NewParentPacketContactInput;

  @Field((type) => CreateStudentPersonAddressInput)
  student?: CreateStudentPersonAddressInput;

  @Field()
  school_year_id?: number;
}
