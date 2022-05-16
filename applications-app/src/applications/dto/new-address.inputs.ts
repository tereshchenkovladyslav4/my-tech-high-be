import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { CreateStudentPersonInput } from '../dto/new-student-person.inputs';

@InputType()
export class CreateAddressInput {
  @Field(() => Int, { nullable: true })
  address_id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  street?: string;

  @Field(() => String, { nullable: true })
  street2?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zip?: string;

  @Field(() => Number, { nullable: true })
  county_id?: number;
}
