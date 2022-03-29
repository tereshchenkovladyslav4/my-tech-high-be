import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { CreateStudentPersonInput } from '../dto/new-student-person.inputs';

@InputType()
export class CreateParentStudentInput {  
  @Field(() => Int)
  program_year?: number

  @Field((type) => [CreateStudentPersonInput], {nullable: true})
  students?: CreateStudentPersonInput[]
}
