import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, In, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../models/student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "packet_id, student_id")')
@Entity('mth_packet')
export class Packet extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  packet_id?: number;

  @Column()
  @Directive('@external')
  student_id?: number;

  @Column()
  status?: string;

  @Column()
  deadline: Date;

  @Column()
  date_submitted: Date;

  @Column()
  date_last_submitted: Date;

  @Column()
  date_accepted: Date;

  @Column()
  school_district?: string;

  @Column()
  special_ed?: string;

  @Column()
  understands_special_ed?: number;

  @Column()
  special_ed_desc?: string;

  @Column()
  last_school?: string;

  @Column()
  last_school_address?: string;

  @Column()
  last_school_type?: number;

  @Column()
  permission_to_request_records?: number;

  @Column()
  hispanic?: number;

  @Column()
  race?: string;

  @Column()
  language_home?: string;

  @Column()
  language_home_child?: string;

  @Column()
  language_friends?: string;

  @Column()
  language_home_preferred?: string;

  @Column()
  work_move?: number;

  @Column()
  living_location?: number;

  @Column()
  lives_with?: number;

  @Column()
  secondary_contact_first?: string;

  @Column()
  secondary_phone?: string;

  @Column()
  secondary_email?: string;

  @Column()
  birth_place?: string;

  @Column()
  birth_country?: string;

  @Column()
  worked_in_agriculture?: number;

  @Column()
  military?: number;

  @Column()
  household_size?: number;

  @Column()
  household_income?: number;

  @Column()
  agrees_to_policy?: number;

  @Column()
  approves_enrollment?: number;

  @Column()
  ferpa_agreement?: number;

  @Column()
  photo_permission?: number;

  @Column()
  dir_permission?: number;

  @Column()
  signature_name?: string;

  @Column()
  signature_file_id?: number;

  @Column()
  reupload_files?: string;

  @Column()
  understands_sped_scheduling?: number;

  @Column()
  deleted?: number;

  @Column()
  military_branch?: string;

  @Column()
  exemp_immunization?: number;

  @Column()
  exemption_form_date?: Date;

  @Column()
  reenroll_files?: string;

  @Column()
  admin_notes?: string;

  @Column()
  immunization_notes?: string;

  @Column()
  medical_exemption?: number;

  @Column()
  date_assigned_to_soe?: Date;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  is_age_issue?: boolean;

  @ManyToOne((type) => Student, (student) => student.packets)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;
}
