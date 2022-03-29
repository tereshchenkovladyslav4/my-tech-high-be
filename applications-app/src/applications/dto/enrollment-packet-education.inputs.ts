import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, MaxLength, IsEmail, Length, IsInt } from 'class-validator';
import { CreateParentPersonInput } from './new-parent-person.inputs';
import { CreateStudentPersonInput } from './new-student-person.inputs';

@InputType()
export class EnrollmentPacketEducationInput {
  @Field()
  packet_id?: number

  @Field()
  school_year_id?: number

  @Field({nullable: true})
  grade_level?: string

  @Field({nullable: true})
  school_district?: string

  @Field({nullable: true})
  special_ed?: string

  @Field({nullable: true})
  understands_special_ed?: number

  @Field({nullable: true})
  special_ed_desc?: string

  @Field({nullable: true})
  last_school_type?: number

  @Field({nullable: true})
  last_school?: string

  @Field({nullable: true})
  last_school_address?: string

  @Field({nullable: true})
  permission_to_request_records?: string
}
