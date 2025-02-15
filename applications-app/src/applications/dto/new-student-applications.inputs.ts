import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateStudentPacketInput } from './new-student-packet.inputs';

@InputType()
export class CreateStudentApplicationsInput {
  @Field(() => String)
  state?: string;

  @Field(() => Int)
  program_year?: number;

  @Field(() => [CreateStudentPacketInput], { nullable: true })
  students?: CreateStudentPacketInput[];

  @Field(() => String, { nullable: true })
  meta?: string;

  @Field(() => Boolean, { nullable: true })
  midyear_application: boolean;
}
