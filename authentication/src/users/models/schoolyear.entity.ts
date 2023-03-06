import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_year_id, date_begin, date_end, date_reg_open, date_reg_close, RegionId, grades, special_ed, special_ed_options, birth_date_cut, enrollment_packet, SchoolPartners, midyear_application, midyear_application_open, midyear_application_close, testing_preference_title, testing_preference_description, opt_out_form_title, opt_out_form_description, schedule, diploma_seeking, testing_preference, schedule_builder_open, schedule_builder_close, second_semester_open, second_semester_close, midyear_schedule_open, midyear_schedule_close, homeroom_resource_open, homeroom_resource_close, learning_logs, learning_logs_first_second_semesters, reimbursements, require_software, direct_orders, direct_order_open, direct_order_close, reimbursement_open, reimbursement_close, custom_built_open, custom_built_close, require_software_open, require_software_close, third_party_open, third_party_close, mid_direct_order_open, mid_direct_order_close, mid_reimbursement_open, mid_reimbursement_close, mid_custom_built_open, mid_custom_built_close, mid_require_software_open, mid_require_software_close, mid_third_party_open, mid_third_party_close, ScheduleBuilder, Resources, ReimbursementSetting, IsCurrentYear, direct_orders_technology_instructions, direct_orders_supplement_instructions, direct_orders_custom_built_instructions, reimbursements_technology_instructions, reimbursements_supplement_instructions, reimbursements_custom_built_instructions, reimbursements_third_party_instructions, reimbursements_required_software_instructions, StudentLearningLogs, HomeroomSettings")',
)
@Entity({ name: 'mth_schoolyear' })
export class SchoolYear extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  school_year_id?: number;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_begin: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_end: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_reg_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  date_reg_close: string;

  @Column()
  second_sem_start: Date;

  @Column()
  second_sem_open: Date;

  @Column()
  second_sem_close: Date;

  @Column()
  re_enroll_open: Date;

  @Column()
  re_enroll_deadline: Date;

  @Column()
  log_submission_close: Date;

  @Column()
  application_close: Date;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_application_open: string;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_application_close: string;

  @Column()
  first_sem_learning_logs_close: Date;

  @Column()
  re_enroll_notification?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  midyear_application?: number;

  @Column('int', { name: 'RegionId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  RegionId: number | null;

  @Column({ type: 'date' })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  birth_date_cut: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  special_ed: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  special_ed_options: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  enrollment_packet: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grades: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  testing_preference_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  testing_preference_description: string;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  opt_out_form_title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  opt_out_form_description: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  direct_orders_technology_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  direct_orders_supplement_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  direct_orders_custom_built_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reimbursements_technology_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reimbursements_supplement_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reimbursements_custom_built_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reimbursements_third_party_instructions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reimbursements_required_software_instructions: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  schedule: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  diploma_seeking: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  testing_preference: boolean;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  schedule_builder_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  schedule_builder_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  second_semester_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  second_semester_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_schedule_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  midyear_schedule_close: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  homeroom_resource_open: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  homeroom_resource_close: string;

  @Column('tinyint', { name: 'learning_logs', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  learning_logs: boolean;

  @Column('tinyint', { name: 'learning_logs_first_second_semesters', nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  learning_logs_first_second_semesters: boolean;
}
