import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  In,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { PacketFile } from './packet-file.entity';
import { PacketEmail } from './packet-email.entity';

export enum StatusEnum {
  not_started = 'Not Started',
  missing_info = 'Missing Info',
  submitted = 'Submitted',
  resubmitted = 'Resubmitted',
  age_issue = 'Age Issue',
  conditional = 'Aonditional',
  accepted = 'Accepted',
}

@InputType('packet')
@ObjectType()
@Directive('@key(fields: "packet_id")')
@Entity('mth_packet')
export class Packet extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  packet_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  status?: string;

  @Column()
  @Field({ nullable: true, defaultValue: null })
  deadline: Date;

  @Column()
  @Field({ nullable: true, defaultValue: null })
  date_submitted: Date;

  @Column()
  @Field({ nullable: true, defaultValue: null })
  date_last_submitted: Date;

  @Column()
  @Field({ nullable: true, defaultValue: null })
  date_accepted: Date;

  @Column()
  @Field(() => String, { nullable: true })
  school_district?: string;

  @Column()
  @Field(() => String, { nullable: true })
  special_ed?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  understands_special_ed?: number;

  @Column()
  @Field(() => String, { nullable: true })
  special_ed_desc?: string;

  @Column()
  @Field(() => String, { nullable: true })
  last_school?: string;

  @Column()
  @Field(() => String, { nullable: true })
  last_school_address?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  last_school_type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  permission_to_request_records?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  hispanic?: number;

  @Column()
  @Field(() => String, { nullable: true })
  race?: string;

  @Column()
  @Field(() => String, { nullable: true })
  language?: string;

  @Column()
  @Field(() => String, { nullable: true })
  language_home?: string;

  @Column()
  @Field(() => String, { nullable: true })
  language_home_child?: string;

  @Column()
  @Field(() => String, { nullable: true })
  language_friends?: string;

  @Column()
  @Field(() => String, { nullable: true })
  language_home_preferred?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  work_move?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  living_location?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  lives_with?: number;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_contact_first?: string;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_contact_last?: string;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_phone?: string;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_email?: string;

  @Column()
  @Field(() => String, { nullable: true })
  birth_place?: string;

  @Column()
  @Field(() => String, { nullable: true })
  birth_country?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  worked_in_agriculture?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  military?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  household_size?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  household_income?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  agrees_to_policy?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  approves_enrollment?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  ferpa_agreement?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  photo_permission?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  dir_permission?: number;

  @Column()
  @Field(() => String, { nullable: true })
  signature_name?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  signature_file_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  reupload_files?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  understands_sped_scheduling?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  deleted?: number;

  @Column()
  @Field(() => String, { nullable: true })
  military_branch?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  exemp_immunization?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  exemption_form_date?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  reenroll_files?: string;

  @Column()
  @Field(() => String, { nullable: true })
  admin_notes?: string;

  @Column()
  @Field(() => String, { nullable: true })
  immunization_notes?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  medical_exemption?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  date_assigned_to_soe?: Date;

  @ManyToOne((type) => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;

  @Field((type) => [PacketFile])
  files?: PacketFile[];

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  is_age_issue?: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  missing_files?: string;

  @OneToMany(type => PacketEmail, packet_email => packet_email.packet)
  @JoinColumn({ name: 'packet_id', referencedColumnName: 'packet_id' })
  packet_emails: PacketEmail[];
  
  @Column()
  @Field(() => String, { nullable: true })
  meta?: string;
}
