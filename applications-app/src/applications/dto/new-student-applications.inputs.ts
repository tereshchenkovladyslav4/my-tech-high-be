import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class CreateStudentApplicationsInput {
  @Field(() => String)
  state?: string

  @Field(() => Int)
  program_year?: number

  @Field((type) => [CreateStudentPersonInput], {nullable: true})
  students?: CreateStudentPersonInput[]
}
