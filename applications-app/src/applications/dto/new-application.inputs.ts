import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class CreateApplicationInput {
  @Field(() => String)
  state?: string;

  @Field(() => Int)
  program_year?: number;

  @Field((type) => CreateParentPersonInput)
  parent?: CreateParentPersonInput;

  @Field((type) => [CreateStudentPersonInput], { nullable: true })
  students?: CreateStudentPersonInput[];

  @Field({ nullable: true })
  referred_by?: string;

  @Field({ nullable: true })
  meta?: string;

  @Field(() => Boolean, { nullable: true })
  midyear_application: boolean;
}
