import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EnrollmentPacketInput {
  @Field(() => Int)
  packet_id?: number;

  @Field(() => Int, { nullable: true })
  student_person_id?: number;

  @Field(() => Int, { nullable: true })
  parent_person_id?: number;

  @Field(() => String, { nullable: true })
  secondary_contact_first?: string;

  @Field(() => String, { nullable: true })
  secondary_contact_last?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  exemption_form_date?: string;

  @Field(() => Number, { nullable: true })
  medical_exemption?: number;

  @Field(() => String, { nullable: true })
  secondary_phone?: string;

  @Field(() => String, { nullable: true })
  secondary_email?: string;

  @Field(() => String, { nullable: true })
  admin_notes?: string;

  @Field(() => String, { nullable: true })
  date_of_birth?: string;

  @Field(() => String, { nullable: true })
  birth_place?: string;

  @Field(() => String, { nullable: true })
  birth_country?: string;

  @Field(() => Int, { nullable: true })
  hispanic?: number;

  @Field(() => String, { nullable: true })
  race?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  language?: string;

  @Field(() => String, { nullable: true })
  language_home?: string;

  @Field(() => String, { nullable: true })
  language_home_child?: string;

  @Field(() => String, { nullable: true })
  language_friends?: string;

  @Field(() => String, { nullable: true })
  language_home_preferred?: string;

  @Field(() => Int, { nullable: true })
  last_school_type?: number;

  @Field(() => String, { nullable: true })
  last_school?: string;

  @Field(() => String, { nullable: true })
  last_school_address?: string;

  @Field(() => String, { nullable: true })
  school_district?: string;

  @Field(() => Int, { nullable: true })
  household_size?: number;

  @Field(() => Int, { nullable: true })
  household_income?: number;

  @Field(() => Int, { nullable: true })
  worked_in_agriculture?: number;

  @Field(() => Int, { nullable: true })
  military?: number;

  @Field(() => Int, { nullable: true })
  ferpa_agreement?: number;

  @Field(() => Int, { nullable: true })
  dir_permission?: number;

  @Field(() => Int, { nullable: true })
  photo_permission?: number;

  @Field(() => Boolean, { nullable: true })
  is_age_issue?: boolean;

  @Field(() => String, { nullable: true })
  missing_files?: string;

  @Field({ nullable: true })
  meta?: string;
}
