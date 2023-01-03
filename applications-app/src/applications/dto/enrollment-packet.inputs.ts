import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateStudentPersonAddressInput } from './new-student-person-address.inputs';
import { NewParentPacketContactInput } from './new-parent-packet-contact.inputs';
import { CreateParentPersonInput } from './new-parent-person.inputs';

@InputType()
export class EnrollmentPacketInput {
  @Field(() => Int)
  packet_id?: number;

  @Field(() => Int, { nullable: true })
  student_person_id?: number;

  @Field(() => Int, { nullable: true })
  parent_person_id?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  exemption_form_date?: string;

  @Field(() => Number, { nullable: true })
  medical_exemption?: number;

  @Field(() => String, { nullable: true })
  admin_notes?: string;

  @Field(() => Boolean, { nullable: true })
  is_age_issue?: boolean;

  @Field(() => String, { nullable: true })
  missing_files?: string;

  @Field({ nullable: true })
  meta?: string;

  @Field((type) => CreateStudentPersonAddressInput, { nullable: true })
  student?: CreateStudentPersonAddressInput;

  @Field((type) => NewParentPacketContactInput, { nullable: true })
  packet?: NewParentPacketContactInput;

  @Field((type) => CreateParentPersonInput, { nullable: true })
  parent?: CreateParentPersonInput;

  @Field({ nullable: true })
  school_year_id?: number;

  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Field(() => Boolean, { nullable: true })
  fromAdmin?: boolean;
}
