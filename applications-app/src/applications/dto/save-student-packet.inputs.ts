import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SaveStudentPacketInput {
  @Field(() => Int, { nullable: true })
  packet_id?: number;

  @Field(() => Int)
  student_id?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field({ nullable: true })
  deadline?: string;

  @Field({ nullable: true, defaultValue: null })
  date_submitted?: Date;

  @Field({ nullable: true, defaultValue: null })
  date_last_submitted?: Date;

  @Field({ nullable: true, defaultValue: null })
  date_accepted?: Date;

  @Field(() => String, { nullable: true })
  school_district?: string;

  @Field(() => String, { nullable: true })
  special_ed?: string;

  @Field(() => Int, { nullable: true })
  understands_special_ed?: number;

  @Field(() => String, { nullable: true })
  special_ed_desc?: string;

  @Field(() => String, { nullable: true })
  last_school?: string;

  @Field(() => String, { nullable: true })
  last_school_address?: string;

  @Field(() => Int, { nullable: true })
  last_school_type?: number;

  @Field(() => Int, { nullable: true })
  permission_to_request_records?: number;

  @Field(() => Int, { nullable: true })
  hispanic?: number;

  @Field(() => String, { nullable: true })
  race?: string;

  @Field(() => String, { nullable: true })
  language?: string;

  @Field(() => String, { nullable: true })
  language_first_learned?: string;

  @Field(() => String, { nullable: true })
  language_home?: string;

  @Field(() => String, { nullable: true })
  language_home_child?: string;

  @Field(() => String, { nullable: true })
  language_friends?: string;

  @Field(() => String, { nullable: true })
  language_home_preferred?: string;

  @Field(() => Int, { nullable: true })
  work_move?: number;

  @Field(() => Int, { nullable: true })
  living_location?: number;

  @Field(() => Int, { nullable: true })
  lives_with?: number;

  @Field(() => String, { nullable: true })
  secondary_contact_first?: string;

  @Field(() => String, { nullable: true })
  secondary_contact_last?: string;

  @Field(() => String, { nullable: true })
  secondary_phone?: string;

  @Field(() => String, { nullable: true })
  secondary_email?: string;

  @Field(() => String, { nullable: true })
  birth_place?: string;

  @Field(() => String, { nullable: true })
  birth_country?: string;

  @Field(() => Int, { nullable: true })
  worked_in_agriculture?: number;

  @Field(() => Int, { nullable: true })
  military?: number;

  @Field(() => Int, { nullable: true })
  household_size?: number;

  @Field(() => Int, { nullable: true })
  household_income?: number;

  @Field(() => Int, { nullable: true })
  agrees_to_policy?: number;

  @Field(() => Int, { nullable: true })
  approves_enrollment?: number;

  @Field(() => Int, { nullable: true })
  ferpa_agreement?: number;

  @Field(() => Int, { nullable: true })
  photo_permission?: number;

  @Field(() => Int, { nullable: true })
  dir_permission?: number;

  @Field(() => String, { nullable: true })
  signature_name?: string;

  @Field(() => Int, { nullable: true })
  signature_file_id?: number;

  @Field(() => String, { nullable: true })
  reupload_files?: string;

  @Field(() => Int, { nullable: true })
  understands_sped_scheduling?: number;

  @Field(() => Int, { nullable: true })
  deleted?: number;

  @Field(() => String, { nullable: true })
  military_branch?: string;

  @Field(() => Int, { nullable: true })
  exemp_immunization?: number;

  @Field(() => Date, { nullable: true })
  exemption_form_date?: Date;

  @Field(() => String, { nullable: true })
  reenroll_files?: string;

  @Field(() => String, { nullable: true })
  admin_notes?: string;

  @Field(() => String, { nullable: true })
  immunization_notes?: string;

  @Field(() => Int, { nullable: true })
  medical_exemption?: number;

  @Field(() => Date, { nullable: true })
  date_assigned_to_soe?: Date;

  @Field(() => Boolean, { nullable: true })
  is_age_issue?: boolean;

  @Field({ nullable: true })
  meta?: string;
}
