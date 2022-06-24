import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateStudentPacketInput } from './new-student-packet.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class CreateStudentApplicationsInput {
  @Field(() => String)
  state?: string;

  @Field(() => Int)
  program_year?: number;

  @Field((type) => [CreateStudentPacketInput], { nullable: true })
  students?: CreateStudentPacketInput[];

  @Field(() => String, { nullable: true })
  meta?: string;
}
