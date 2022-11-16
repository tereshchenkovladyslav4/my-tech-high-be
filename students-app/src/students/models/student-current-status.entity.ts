import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { SchoolYear } from './schoolyear.entity';
import { Application } from './application.entity';
import { Packet } from './packet.entity';

@ObjectType()
export class StudentCurrentStatus {
  @Field(() => ID, { nullable: true })
  student_id?: number;

  @Field((type) => Int, { nullable: true })
  school_year_id?: number;

  @Field((type) => String, { nullable: true })
  grade_level?: string;

  @Field((type) => Int, { nullable: true })
  application_id?: number;

  @Field((type) => String, { nullable: true })
  application_status?: string;

  @Field((type) => Int, { nullable: true })
  application_school_year_id?: number;

  @Field(() => Date, { nullable: true })
  application_date_started?: Date;

  @Field(() => Date, { nullable: true })
  application_date_submitted?: Date;

  @Field(() => String, { nullable: true })
  application_date_accepted?: string;

  @Field((type) => Int, { nullable: true })
  packet_id?: number;

  @Field((type) => String, { nullable: true })
  packet_status?: string;

  @Field((type) => Int, { nullable: true })
  application_deadline_num_days?: number;

  @Field((type) => Int, { nullable: true })
  enrollment_packet_deadline_num_days?: number;

  @Field(() => String, { nullable: true })
  enrollment_packet_date_deadline?: string;

  @Field(() => Int, { nullable: true })
  withdraw_deadline_num_days?: number;

  @Field(() => Boolean, { nullable: true })
  midyear_application?: boolean;

  @Field(() => String, { nullable: true })
  schedule_builder_close?: string;

  @Field(() => String, { nullable: true })
  schedule_builder_open?: string;

  @Field(() => String, { nullable: true })
  midyear_schedule_close?: string;

  @Field(() => String, { nullable: true })
  midyear_schedule_open?: string;

  @Field(() => String, { nullable: true })
  second_semester_open?: string;

  @Field(() => String, { nullable: true })
  second_semester_close?: string;

  @Field(() => String, { nullable: true })
  special_ed_options?: string;
}
