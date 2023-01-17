import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateStudentPersonInput } from '../dto/new-student-person.inputs';

@InputType()
export class CreateParentStudentInput {
  @Field(() => Int)
  program_year?: number;

  @Field(() => [CreateStudentPersonInput], { nullable: true })
  students?: CreateStudentPersonInput[];
}
