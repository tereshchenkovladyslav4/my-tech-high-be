import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, MaxLength, IsEmail, Length, IsInt } from 'class-validator';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class EnrollmentPacketPersonalInput {
  @Field()
  packet_id?: number

  @Field(() => Date, {nullable: true})
  birth_date?: Date

  @Field({nullable: true})
  birth_place?: string

  @Field({nullable: true})
  birth_country?: string

  @Field(() => String, {nullable: true})
  race?: string

  @Field({nullable: true})
  gender?: string

  @Field({nullable: true})
  hispanic?: number

  @Field({nullable: true})
  language?: string

  @Field({nullable: true})
  language_first_learned?: string

  @Field({nullable: true})
  language_home?: string

  @Field({nullable: true})
  language_home_child?: string

  @Field({nullable: true})
  language_friends?: string

  @Field({nullable: true})
  language_home_preferred?: string

  @Field({nullable: true})
  household_size?: number

  @Field({nullable: true})
  household_income?: number

  @Field({nullable: true})
  worked_in_agriculture?: number

  @Field({nullable: true})
  military?: number

  @Field({nullable: true})
  work_move?: number

  @Field({nullable: true})
  living_location?: number

  @Field({nullable: true})
  lives_with?: number
}
