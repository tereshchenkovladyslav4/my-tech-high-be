import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonAddressInput } from './new-student-person-address.inputs';

@InputType()
export class EnrollmentPacketContactInput {
  @Field(() => Int)
  student_id?: number

  @Field((type) => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field((type) => CreateParentPersonInput)
  secondaryParent?: CreateParentPersonInput;

  @Field((type) => CreateStudentPersonAddressInput)
  student?: CreateStudentPersonAddressInput;  
 }
