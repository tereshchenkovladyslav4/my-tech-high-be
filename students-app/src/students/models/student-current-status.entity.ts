import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { SchoolYear } from './schoolyear.entity';
import { Application } from './application.entity';
import { Packet } from './packet.entity';

@ObjectType()
export class StudentCurrentStatus {
  @Field(() => ID, { nullable: true })
  student_id?: number

  @Field((type) => Int, { nullable: true })
  school_year_id?: number

  @Field((type) => String, { nullable: true })
  grade_level?: string

  @Field((type) => Int, { nullable: true })
  application_id?: number

  @Field((type) => String, { nullable: true })
  application_status?: string

  @Field((type) => Int, { nullable: true })
  application_school_year_id?: number

  @Field((type) => Int, { nullable: true })
  packet_id?: number

  @Field((type) => String, { nullable: true })
  packet_status?: string
}
